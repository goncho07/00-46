import type { ComponentType, ReactNode } from 'react';

export type AppRole = 'director' | 'teacher';

export interface RouteDefinition {
  path: string;
  Component: ComponentType;
}

export interface RoleRouteGroup {
  layout: ComponentType<{ children: ReactNode }>;
  routes: RouteDefinition[];
  fallback: string;
}

export type RoleRouteConfig = Record<AppRole, RoleRouteGroup>;
