import { cookies } from 'next/headers';

const NAME = 'sidebar-collapsed';

export interface SidebarCookie {
  isCollapsed: boolean;
}

export const sidebarCookie = {
  async get(): Promise<SidebarCookie> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(NAME);
    const isCollapsed = cookie?.value === 'true';

    return { isCollapsed };
  },
  async set(value: SidebarCookie) {
    // Assuming a custom method to set cookies is available
    document.cookie = `${NAME}=${String(value.isCollapsed)}; path=/`;
  },
};
