
import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { ensureTutor } from "@/lib/ensure-tutor";

const HomeLayout = async ({children}: {children: ReactNode}) => {

    const clerkAuth = await auth()
    const tutorId = await ensureTutor()     // having in layout ensures the check happens upon every navigation

    // If no active session/user, redirect to sign-in
    if (!clerkAuth.userId || !tutorId) redirect('/sign-in')


    return (
    <main className='relative'>
        <NavBar />

        <div className='flex'>
            <SideBar />

            <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28
            max-md:pb-14 sm:px-14 '>
                <div className='w-full'>
                    {children}
                </div>
            </section>
        </div>
    </main>
    )
}

export default HomeLayout