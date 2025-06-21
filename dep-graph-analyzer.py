#!/usr/bin/env python3
"""
Dependency Graph Analyzer for React/TypeScript Projects
Extracts all import/export relationships and builds a complete dependency graph.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, asdict
import ast
from collections import defaultdict

@dataclass
class ImportInfo:
    """Represents an import relationship"""
    from_file: str
    to_file: str
    import_type: str  # 'static', 'dynamic', 're-export'
    import_name: Optional[str] = None
    is_external: bool = False

@dataclass
class FileNode:
    """Represents a file in the dependency graph"""
    id: str
    type: str  # 'entry', 'component', 'service', 'utility', 'test'
    imports: int = 0
    imported_by: int = 0
    is_orphaned: bool = False

class DependencyGraphAnalyzer:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.src_root = self.project_root / "src"
        self.nodes: Dict[str, FileNode] = {}
        self.edges: List[ImportInfo] = []
        self.file_contents: Dict[str, str] = {}
        
        # Patterns for different import types
        self.import_patterns = {
            'static_import': re.compile(r'import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?[\'"]([^\'"]+)[\'"]', re.MULTILINE),
            'dynamic_import': re.compile(r'import\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)', re.MULTILINE),
            'lazy_import': re.compile(r'React\.lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)\s*\)', re.MULTILINE),
            'require': re.compile(r'require\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)', re.MULTILINE),
            'export_from': re.compile(r'export\s+(?:\{[^}]*\}|\*)\s+from\s+[\'"]([^\'"]+)[\'"]', re.MULTILINE),
        }
        
        # File type classification
        self.file_type_patterns = {
            'entry': ['main.tsx', 'main.ts', 'index.html'],
            'test': ['.test.', '.spec.', '__tests__'],
            'config': ['config.', 'setup.', '.config.'],
            'type': ['.d.ts', 'types.ts'],
        }
        
    def get_all_source_files(self) -> List[Path]:
        """Get all TypeScript/JavaScript source files"""
        extensions = ['.ts', '.tsx', '.js', '.jsx']
        files = []
        
        for ext in extensions:
            files.extend(self.src_root.rglob(f'*{ext}'))
            
        # Also check for entry points at project root
        for pattern in ['*.ts', '*.tsx', '*.js', '*.jsx']:
            files.extend(self.project_root.glob(pattern))
            
        return sorted(files)
    
    def classify_file_type(self, file_path: Path) -> str:
        """Classify file type based on path and name"""
        relative_path = str(file_path.relative_to(self.project_root))
        
        # Check patterns
        for file_type, patterns in self.file_type_patterns.items():
            if any(pattern in relative_path for pattern in patterns):
                return file_type
                
        # Classify by directory structure
        parts = file_path.parts
        if 'components' in parts:
            return 'component'
        elif 'services' in parts or 'api' in parts:
            return 'service'  
        elif 'utils' in parts or 'lib' in parts:
            return 'utility'
        elif 'pages' in parts:
            return 'page'
        elif 'hooks' in parts:
            return 'hook'
        elif 'context' in parts or 'providers' in parts:
            return 'context'
        elif 'features' in parts:
            return 'feature'
        else:
            return 'module'
    
    def resolve_import_path(self, import_path: str, from_file: Path) -> Optional[Path]:
        """Resolve import path to actual file"""
        # Skip external packages
        if not import_path.startswith('.') and not import_path.startswith('@/'):
            return None
            
        # Handle path aliases
        if import_path.startswith('@/'):
            import_path = import_path[2:]  # Remove '@/'
            base_path = self.src_root
        else:
            base_path = from_file.parent
            
        # Try different extensions and index files
        possible_paths = []
        
        if import_path.startswith('./') or import_path.startswith('../'):
            resolved_path = (base_path / import_path).resolve()
        else:
            resolved_path = (base_path / import_path).resolve()
            
        # Try various extensions
        extensions = ['.ts', '.tsx', '.js', '.jsx']
        
        # Direct file match
        for ext in extensions:
            candidate = resolved_path.with_suffix(ext)
            if candidate.exists():
                possible_paths.append(candidate)
                
        # Index file match
        if resolved_path.is_dir():
            for ext in extensions:
                candidate = resolved_path / f'index{ext}'
                if candidate.exists():
                    possible_paths.append(candidate)
                    
        # Return first match
        for path in possible_paths:
            if path.exists():
                return path
                
        return None
    
    def extract_imports_from_file(self, file_path: Path) -> List[ImportInfo]:
        """Extract all imports from a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                self.file_contents[str(file_path)] = content
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return []
            
        imports = []
        relative_from = str(file_path.relative_to(self.project_root))
        
        # Extract different types of imports
        for import_type, pattern in self.import_patterns.items():
            matches = pattern.findall(content)
            
            for match in matches:
                import_path = match if isinstance(match, str) else match[0]
                
                # Resolve the import path
                resolved_path = self.resolve_import_path(import_path, file_path)
                
                if resolved_path:
                    relative_to = str(resolved_path.relative_to(self.project_root))
                    
                    # Determine import type
                    if import_type == 'dynamic_import' or import_type == 'lazy_import':
                        imp_type = 'dynamic'
                    elif import_type == 'export_from':
                        imp_type = 're-export'
                    else:
                        imp_type = 'static'
                        
                    imports.append(ImportInfo(
                        from_file=relative_from,
                        to_file=relative_to,
                        import_type=imp_type,
                        import_name=import_path,
                        is_external=False
                    ))
                else:
                    # External import
                    imports.append(ImportInfo(
                        from_file=relative_from,
                        to_file=import_path,
                        import_type='static',
                        import_name=import_path,
                        is_external=True
                    ))
                    
        return imports
    
    def build_dependency_graph(self):
        """Build the complete dependency graph"""
        print("🔍 Scanning for source files...")
        source_files = self.get_all_source_files()
        print(f"Found {len(source_files)} source files")
        
        # Create nodes for all files
        for file_path in source_files:
            relative_path = str(file_path.relative_to(self.project_root))
            file_type = self.classify_file_type(file_path)
            
            self.nodes[relative_path] = FileNode(
                id=relative_path,
                type=file_type
            )
        
        print("📊 Extracting imports...")
        # Extract imports from all files
        for file_path in source_files:
            imports = self.extract_imports_from_file(file_path)
            self.edges.extend(imports)
            
        # Calculate import statistics
        import_counts = defaultdict(int)
        imported_by_counts = defaultdict(int)
        
        for edge in self.edges:
            if not edge.is_external:
                import_counts[edge.from_file] += 1
                imported_by_counts[edge.to_file] += 1
        
        # Update node statistics
        for node_id, node in self.nodes.items():
            node.imports = import_counts[node_id]
            node.imported_by = imported_by_counts[node_id]
            node.is_orphaned = node.imported_by == 0 and node.type not in ['entry', 'test']
            
        print(f"✅ Analysis complete: {len(self.nodes)} files, {len(self.edges)} imports")
    
    def generate_json_output(self) -> dict:
        """Generate JSON output of the dependency graph"""
        # Filter out external dependencies for cleaner graph
        internal_edges = [edge for edge in self.edges if not edge.is_external]
        
        # Find orphaned files
        orphaned_files = [node for node in self.nodes.values() if node.is_orphaned]
        
        return {
            "nodes": [asdict(node) for node in self.nodes.values()],
            "edges": [asdict(edge) for edge in internal_edges],
            "stats": {
                "totalFiles": len(self.nodes),
                "totalImports": len(internal_edges),
                "orphanedFiles": len(orphaned_files),
                "externalDependencies": len([e for e in self.edges if e.is_external]),
                "entryPoints": len([n for n in self.nodes.values() if n.type == 'entry']),
                "fileTypes": {
                    file_type: len([n for n in self.nodes.values() if n.type == file_type])
                    for file_type in set(n.type for n in self.nodes.values())
                }
            },
            "orphanedFiles": [node.id for node in orphaned_files]
        }
    
    def generate_mermaid_output(self) -> str:
        """Generate Mermaid diagram of the dependency graph"""
        mermaid = ["graph TD"]
        
        # Filter to show only key relationships to avoid overwhelming diagram
        internal_edges = [edge for edge in self.edges if not edge.is_external]
        
        # Focus on entry points and their immediate dependencies
        entry_points = [n.id for n in self.nodes.values() if n.type == 'entry']
        important_files = set(entry_points)
        
        # Add files imported by entry points
        for edge in internal_edges:
            if edge.from_file in entry_points:
                important_files.add(edge.to_file)
                
        # Add files that import many others (hubs)
        high_import_files = [n.id for n in self.nodes.values() if n.imports > 5]
        important_files.update(high_import_files)
        
        # Generate node definitions with clean names
        node_mapping = {}
        for i, file_id in enumerate(sorted(important_files)):
            clean_name = file_id.replace('src/', '').replace('.tsx', '').replace('.ts', '')
            node_id = f"N{i}"
            node_mapping[file_id] = node_id
            
            # Style based on type
            node = self.nodes.get(file_id)
            if node:
                if node.type == 'entry':
                    mermaid.append(f'    {node_id}["{clean_name}"]')
                    mermaid.append(f'    {node_id} --> {node_id}')
                elif node.type == 'component':
                    mermaid.append(f'    {node_id}(("{clean_name}"))')
                else:
                    mermaid.append(f'    {node_id}["{clean_name}"]')
        
        # Add edges between important files
        for edge in internal_edges:
            if edge.from_file in node_mapping and edge.to_file in node_mapping:
                from_node = node_mapping[edge.from_file]
                to_node = node_mapping[edge.to_file]
                
                if edge.import_type == 'dynamic':
                    mermaid.append(f'    {from_node} -.-> {to_node}')
                else:
                    mermaid.append(f'    {from_node} --> {to_node}')
        
        return '\n'.join(mermaid)
    
    def save_outputs(self):
        """Save both JSON and Mermaid outputs"""
        # Save JSON
        json_output = self.generate_json_output()
        with open(self.project_root / 'dep-graph.json', 'w') as f:
            json.dump(json_output, f, indent=2)
        
        # Save Mermaid
        mermaid_output = self.generate_mermaid_output()
        with open(self.project_root / 'dep-graph.mmd', 'w') as f:
            f.write(mermaid_output)
            
        print(f"📄 Generated dep-graph.json ({len(json_output['nodes'])} nodes)")
        print(f"📊 Generated dep-graph.mmd")
        
        # Print summary
        stats = json_output['stats']
        print(f"\n📈 Dependency Graph Summary:")
        print(f"   Total Files: {stats['totalFiles']}")
        print(f"   Internal Imports: {stats['totalImports']}")
        print(f"   Orphaned Files: {stats['orphanedFiles']}")
        print(f"   External Dependencies: {stats['externalDependencies']}")
        
        if json_output['orphanedFiles']:
            print(f"\n🔍 Orphaned Files (potential cleanup candidates):")
            for orphan in json_output['orphanedFiles'][:10]:  # Show first 10
                print(f"   - {orphan}")
            if len(json_output['orphanedFiles']) > 10:
                print(f"   ... and {len(json_output['orphanedFiles']) - 10} more")

def main():
    project_root = "/Users/damon/liquid-spark-finance"
    
    print("🚀 Starting Dependency Graph Analysis...")
    analyzer = DependencyGraphAnalyzer(project_root)
    analyzer.build_dependency_graph()
    analyzer.save_outputs()
    print("✅ Dependency graph analysis complete!")

if __name__ == "__main__":
    main()