import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <>
        <main className="flex flex-col h-full justify-center max-w-xl mx-auto mb-8">
            <div className="h-full w-full border-x border-gray-200">
                {props.children}
            </div>
            <div className="text-sm font-thin text-right mt-4 px-4">
                &copy; 2023 KNLRVR 
            </div>
        </main>
        </>
    )
}