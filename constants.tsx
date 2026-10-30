
import { LuCalendarArrowUp } from "react-icons/lu";
import { LuCalendarArrowDown } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { HiOutlineHome } from "react-icons/hi2";

import { IconType } from 'react-icons';

export interface SidebarLink {
  id: number;
  label: string;
  href: string;
  icon: IconType; // ← The React Icon component type
}

export const sidebarLinks = [
    {
        label: 'Home',
        icon: HiOutlineHome,
        route: '/'
    },
    {
        label: 'Invoices',
        icon: IoMdAdd,
        route: '/invoices'
    },
    {
        label: 'Students',
        icon: IoMdAdd,
        route: '/students'
    },
]