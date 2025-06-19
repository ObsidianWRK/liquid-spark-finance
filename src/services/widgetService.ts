import { HomeWidget } from "../types";

export interface WidgetService {
  listWidgets: () => Promise<HomeWidget[]>;
  createWidget: (type: "balance" | "safe_to_spend", config?: Record<string, unknown>) => Promise<HomeWidget>;
  deleteWidget: (id: string) => Promise<void>;
}

class MockWidgetService implements WidgetService {
  private widgets: HomeWidget[] = [
    {
      id: "widget-1",
      type: "balance",
      position: 1,
      config: { accountId: "acc1" },
    },
    {
      id: "widget-2", 
      type: "safe_to_spend",
      position: 2,
      config: {},
    },
  ];

  async listWidgets(): Promise<HomeWidget[]> {
    return this.widgets;
  }

  async createWidget(type: "balance" | "safe_to_spend", config = {}): Promise<HomeWidget> {
    const widget: HomeWidget = {
      id: "widget-" + Date.now(),
      type,
      position: this.widgets.length + 1,
      config,
    };
    this.widgets.push(widget);
    return widget;
  }

  async deleteWidget(id: string): Promise<void> {
    this.widgets = this.widgets.filter((w) => w.id !== id);
  }
}

export const widgetService: WidgetService = new MockWidgetService(); 