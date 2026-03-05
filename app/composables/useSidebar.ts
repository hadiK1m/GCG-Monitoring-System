/**
 * useSidebar - Composable for sidebar state management
 *
 * Handles:
 * - Sidebar open/close state (mobile drawer)
 * - Sidebar collapsed state (desktop icon-only mode)
 * - Active menu tracking
 * - Expanded menu groups
 */

export function useSidebar() {
    // Shared state across Header/Sidebar/Layout
    const isOpen = useState<boolean>('sidebar:isOpen', () => false)
    const isCollapsed = useState<boolean>('sidebar:isCollapsed', () => false)

    // Keep as array (serializable) for Nuxt state hydration
    const expandedGroups = useState<string[]>('sidebar:expandedGroups', () => ['dashboard'])

    const activeItem = useState<string>('sidebar:activeItem', () => '/dashboard')

    function toggleSidebar() {
        isOpen.value = !isOpen.value
    }

    function openSidebar() {
        isOpen.value = true
    }

    function closeSidebar() {
        isOpen.value = false
    }

    function toggleCollapse() {
        isCollapsed.value = !isCollapsed.value
    }

    function toggleGroup(groupId: string) {
        if (expandedGroups.value.includes(groupId)) {
            expandedGroups.value = expandedGroups.value.filter((id) => id !== groupId)
            return
        }

        expandedGroups.value = [...expandedGroups.value, groupId]
    }

    function isGroupExpanded(groupId: string): boolean {
        return expandedGroups.value.includes(groupId)
    }

    function setActiveItem(path: string) {
        activeItem.value = path
    }

    return {
        isOpen,
        isCollapsed,
        expandedGroups,
        activeItem,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        toggleCollapse,
        toggleGroup,
        isGroupExpanded,
        setActiveItem,
    }
}
