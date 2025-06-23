import React, { useEffect, useRef } from "react";
import { hackathonData } from "@/utils/store";

const DetailComponent = () => {
  const editorRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Dynamically import EditorJS and Paragraph tool to avoid SSR issues
    let editor;
    let isMounted = true;
    Promise.all([import("@editorjs/editorjs"), import("@editorjs/paragraph")])
      .then(([{ default: EditorJS }, { default: Paragraph }]) => {
        if (!isMounted) return;
        // Prepare initial data from hackathonData.details if available
        let initialData = undefined;
        if (
          hackathonData.details &&
          typeof hackathonData.details === "string" &&
          hackathonData.details.trim() !== ""
        ) {
          initialData = {
            blocks: hackathonData.details
              .split(/\n{2,}/) // split by double line breaks
              .map((text) => ({
                type: "paragraph",
                data: { text },
              })),
          };
        }
        editor = new EditorJS({
          holder: "editorjs",
          tools: {
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
              config: {
                placeholder: "Start writing here...",
              },
            },
          },
          autofocus: true,
          data: initialData,
          onChange: () => {
            // Debounce: wait 1s after last change
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
              if (editorRef.current) {
                editorRef.current
                  .save()
                  .then((outputData) => {
                    hackathonData.details = outputData.blocks
                      .map((block) => block.data.text)
                      .join("\n\n");
                  })
                  .catch((error) => {
                    console.log("Auto-saving failed: ", error);
                  });
              }
            }, 1000);
          },
        });
        editorRef.current = editor;
      })
      .catch((err) => {
        console.error("EditorJS init error:", err);
      });

    return () => {
      isMounted = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      // Save on unmount to persist latest changes
      if (editorRef.current && typeof editorRef.current.save === "function") {
        editorRef.current
          .save()
          .then((outputData) => {
            hackathonData.details = outputData.blocks
              .map((block) => block.data.text)
              .join("\n\n");
          })
          .catch(() => {});
      }
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <p className="text-3xl font-semibold">
        Add all the details about this hackathon.
      </p>
      <div id="editorjs"></div>
    </div>
  );
};

export default DetailComponent;
