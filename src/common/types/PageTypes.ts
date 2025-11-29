export interface ChildrenList {
  id: string;
  title: string;
  enableTitle: boolean;
  type: string;
  url: string;
  icon: React.ElementType;
  element: any;
  target: boolean;
  breadcrumbs: boolean;
}

export interface Pages {
  id: string;
  title: string;
  type: string;
  element: any;
  children: Record<string, ChildrenList>;
}
