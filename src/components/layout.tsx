import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return (
        <>
        <main className="flex h-full justify-center max-w-xl mx-auto">
            <div className="h-full w-full border-x border-gray-200">
                {props.children}
            </div>
        </main>
        </>
    )
}