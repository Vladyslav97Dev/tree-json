import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Fira_Mono, Montserrat } from "next/font/google";
import { PageSEO } from "@/components/PageSEO";
import { classNames } from "@/utility/classNames";
import { Allotment } from "allotment";
import MonacoEditor from "@/components/MonacoEditor";
import EditorInfobar from "@/components/EditorInfobar";
import "allotment/dist/style.css";
import { useApp } from "@/store/useApp";
import { JSON_TEMPLATE } from "@/constants/json";
import Navbar from "@/components/Navbar";
import { useTree } from "@/store/useTree";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const montserrat = Montserrat({ subsets: ["latin"] });

export const firaMono = Fira_Mono({
  weight: ["500"],
  subsets: ["latin"],
});

const TreeEditor = dynamic(() => import("@/components/TreeEditor"), {
  ssr: false,
});

export default function Home() {
  const { isReady } = useRouter();
  const setContents = useApp((state) => state.setContents);
  const fullscreen = useTree((state) => state.fullscreen);
  const toggleFullscreen = useTree((state) => state.toggleFullscreen);

  const { isScreenLessThan } = useBreakpoint(768);

  useEffect(() => {
    if (isReady) {
      setContents({ contents: JSON_TEMPLATE, hasChanges: false });
    }
  }, [isReady, setContents]);

  useEffect(() => {
    if (isScreenLessThan) toggleFullscreen(true);
  }, [isScreenLessThan, toggleFullscreen]);

  return (
    <div className="h-screen">
      <PageSEO
        title="Json Tree Viewer"
        description="Visualisation tool for json in a graph and tree form"
      />
      <div
        className={classNames(
          montserrat.className,
          "h-[calc(100vh-28px)] overflow-hidden",
        )}
      >
        <Navbar />
        <main className="flex h-[calc(100vh-84px)] w-full flex-col md:flex-row">
          <Allotment
            className="!relative flex h-[calc(100vh-84px)]"
            proportionalLayout={false}
          >
            <Allotment.Pane
              className="h-full"
              preferredSize={isScreenLessThan ? "100%" : 450}
              minSize={fullscreen ? 0 : 450}
              maxSize={isScreenLessThan ? Infinity : 700}
              visible={!fullscreen}
            >
              <MonacoEditor />
            </Allotment.Pane>
            <Allotment.Pane
              minSize={0}
              maxSize={isScreenLessThan && !fullscreen ? 0 : Infinity}
              className="flex w-full items-center justify-center"
            >
              <TreeEditor />
            </Allotment.Pane>
          </Allotment>
        </main>
      </div>
      <EditorInfobar />
    </div>
  );
}
