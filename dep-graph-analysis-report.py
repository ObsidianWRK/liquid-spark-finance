#!/usr/bin/env python3
"""
Enhanced Dependency Graph Analysis Report
Provides detailed insights into the codebase structure and potential issues.
"""

import json
from collections import defaultdict, Counter
from pathlib import Path

def analyze_dependency_graph():
    """Analyze the generated dependency graph and create detailed reports"""
    
    # Load the generated dependency graph
    with open('dep-graph.json', 'r') as f:
        graph_data = json.load(f)
    
    nodes = {node['id']: node for node in graph_data['nodes']}
    edges = graph_data['edges']
    stats = graph_data['stats']
    orphaned_files = graph_data['orphanedFiles']
    
    print("🔍 DEPENDENCY GRAPH ANALYSIS REPORT")
    print("=" * 50)
    
    # 1. Entry Points Analysis
    print("\n📍 ENTRY POINTS")
    entry_points = [node for node in nodes.values() if node['type'] == 'entry']
    for entry in entry_points:
        print(f"   • {entry['id']} (imports: {entry['imports']}, imported by: {entry['imported_by']})")
    
    # 2. Most Connected Files (Hubs)
    print("\n🔗 MOST CONNECTED FILES (Import Hubs)")
    by_imports = sorted(nodes.values(), key=lambda x: x['imports'], reverse=True)[:10]
    for node in by_imports:
        print(f"   • {node['id']} → {node['imports']} imports ({node['type']})")
    
    print("\n🎯 MOST IMPORTED FILES (Dependencies)")
    by_imported = sorted(nodes.values(), key=lambda x: x['imported_by'], reverse=True)[:10]
    for node in by_imported:
        print(f"   • {node['id']} ← {node['imported_by']} files depend on it ({node['type']})")
    
    # 3. Orphaned Files Analysis
    print(f"\n🏚️ ORPHANED FILES ({len(orphaned_files)} total)")
    print("Files with zero incoming dependencies (potential candidates for removal):")
    
    # Group orphaned files by type/directory
    orphaned_by_dir = defaultdict(list)
    for orphan in orphaned_files:
        if '/' in orphan:
            dir_path = '/'.join(orphan.split('/')[:-1])
            orphaned_by_dir[dir_path].append(orphan)
        else:
            orphaned_by_dir['root'].append(orphan)
    
    for directory, files in sorted(orphaned_by_dir.items()):
        if len(files) > 3:
            print(f"   📁 {directory}/ ({len(files)} files)")
            for file in files[:3]:
                filename = file.split('/')[-1]
                print(f"      - {filename}")
            if len(files) > 3:
                print(f"      ... and {len(files) - 3} more")
        else:
            print(f"   📁 {directory}/")
            for file in files:
                filename = file.split('/')[-1]
                print(f"      - {filename}")
    
    # 4. File Type Distribution
    print(f"\n📊 FILE TYPE DISTRIBUTION")
    for file_type, count in sorted(stats['fileTypes'].items(), key=lambda x: x[1], reverse=True):
        percentage = (count / stats['totalFiles']) * 100
        print(f"   • {file_type.capitalize()}: {count} files ({percentage:.1f}%)")
    
    # 5. Import Type Analysis
    print(f"\n🔄 IMPORT TYPE ANALYSIS")
    import_types = Counter(edge['import_type'] for edge in edges)
    for import_type, count in sorted(import_types.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(edges)) * 100
        print(f"   • {import_type}: {count} imports ({percentage:.1f}%)")
    
    # 6. Circular Dependencies Detection (Basic)
    print(f"\n🔄 CIRCULAR DEPENDENCY RISK ANALYSIS")
    high_interconnected = []
    for node in nodes.values():
        if node['imports'] > 5 and node['imported_by'] > 5:
            high_interconnected.append(node)
    
    if high_interconnected:
        print("Files with high bi-directional connectivity (potential circular dependency risk):")
        for node in sorted(high_interconnected, key=lambda x: x['imports'] + x['imported_by'], reverse=True)[:5]:
            total_connections = node['imports'] + node['imported_by']
            print(f"   • {node['id']} ({total_connections} total connections)")
    else:
        print("   ✅ No files with high bi-directional connectivity detected")
    
    # 7. Feature Module Analysis
    print(f"\n🎛️ FEATURE MODULE ANALYSIS")
    feature_files = [node for node in nodes.values() if 'features/' in node['id']]
    feature_modules = defaultdict(list)
    
    for node in feature_files:
        parts = node['id'].split('/')
        if len(parts) >= 3 and parts[1] == 'features':
            feature_name = parts[2]
            feature_modules[feature_name].append(node)
    
    print(f"Found {len(feature_modules)} feature modules:")
    for feature, files in sorted(feature_modules.items(), key=lambda x: len(x[1]), reverse=True):
        avg_imports = sum(f['imports'] for f in files) / len(files) if files else 0
        avg_imported_by = sum(f['imported_by'] for f in files) / len(files) if files else 0
        print(f"   • {feature}: {len(files)} files (avg imports: {avg_imports:.1f}, avg imported by: {avg_imported_by:.1f})")
    
    # 8. Potential Issues & Recommendations
    print(f"\n⚠️ POTENTIAL ISSUES & RECOMMENDATIONS")
    
    # Large import counts
    heavy_importers = [node for node in nodes.values() if node['imports'] > 20]
    if heavy_importers:
        print(f"   🚨 {len(heavy_importers)} files with >20 imports (consider breaking down):")
        for node in sorted(heavy_importers, key=lambda x: x['imports'], reverse=True)[:3]:
            print(f"      - {node['id']} ({node['imports']} imports)")
    
    # High fan-out dependencies
    critical_deps = [node for node in nodes.values() if node['imported_by'] > 15]
    if critical_deps:
        print(f"   🎯 {len(critical_deps)} files imported by >15 others (critical dependencies):")
        for node in sorted(critical_deps, key=lambda x: x['imported_by'], reverse=True)[:3]:
            print(f"      - {node['id']} (used by {node['imported_by']} files)")
    
    # Component organization
    component_files = [node for node in nodes.values() if node['type'] == 'component']
    orphaned_components = [node for node in component_files if node['imported_by'] == 0]
    if orphaned_components:
        print(f"   🗑️ {len(orphaned_components)} unused components (cleanup candidates):")
        for node in orphaned_components[:5]:
            print(f"      - {node['id']}")
    
    # Test coverage gaps
    test_files = [node for node in nodes.values() if node['type'] == 'test']
    source_files = [node for node in nodes.values() if node['type'] in ['component', 'service', 'utility', 'hook']]
    test_ratio = len(test_files) / len(source_files) if source_files else 0
    print(f"   📝 Test coverage ratio: {test_ratio:.2f} ({len(test_files)} tests for {len(source_files)} source files)")
    if test_ratio < 0.3:
        print(f"      ⚠️ Low test coverage - consider adding more tests")
    
    print(f"\n✅ ANALYSIS COMPLETE")
    print(f"Total files analyzed: {stats['totalFiles']}")
    print(f"Total internal imports: {stats['totalImports']}")
    print(f"External dependencies: {stats['externalDependencies']}")
    print(f"Orphaned files: {stats['orphanedFiles']}")

if __name__ == "__main__":
    analyze_dependency_graph()