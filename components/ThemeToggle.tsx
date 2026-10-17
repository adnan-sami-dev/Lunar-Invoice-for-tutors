import { useState, useEffect } from "react"
import { MdDarkMode } from "react-icons/md"
import { MdLightMode } from "react-icons/md";


const ThemeToggle = () => {

    const [isDark, setIsDark] = useState(false) // for switching the icons (moon/sun)


    // check initial theme
    useEffect( () => {
        const isDarkMode = document.documentElement.classList.contains('dark')
        setIsDark(isDarkMode)
    }, [])

    const toggleTheme = () => {
        const doc = document.documentElement /* this returns the <html> element */

        if (isDark) {
            doc.classList.remove('dark')
            localStorage.setItem('theme','light')
        } else {
            doc.classList.add('dark')
            localStorage.setItem('theme','dark')
        }

        setIsDark(!isDark)
    }
    
    return (
        <button className='p-2 rounded-full hover:bg-sidebar-hover transition-colors cursor-pointer'
            onClick={toggleTheme} 
            aria-label="Toggle theme">
            {
                isDark
                    ? <MdLightMode size={24} /> 
                    : <MdDarkMode size={24} />
            }
        </button>
    )
}

export default ThemeToggle