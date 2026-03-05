/**
 * Sidebar Navigation Data
 * ────────────────────────
 * Defines the complete sidebar menu structure.
 * Each group has an id, label, and array of menu items.
 * Items can have nested children (submenu).
 */

export interface NavItem {
    label: string
    icon?: string
    to?: string
    children?: NavItem[]
    badge?: string
    badgeColor?: string
}

export const sidebarNavigation: NavItem[] = [
    // Dashboard (special styling in sidebar component)
    {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/dashboard',
    },
    {
        label: 'Kertas Kerja ACGS',
        icon: 'i-lucide-clipboard-list',
        children: [
            { label: 'Daftar 193 pertanyaan', icon: 'i-lucide-list', to: '/dashboard/acgs/daftar-193-pertanyaan' },
        ],
    },
]
