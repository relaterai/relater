import type { Metadata } from "next";
import { use } from "react";
import Editor from "./editor";

const title = 'Relater';
const description = 'Your AI pair creator.';

export const metadata: Metadata = {
  title,
  description,
};

const NotePage = (props: { params: Promise<{ noteId: string }> }) => {
  const params = use(props.params);
  const noteId = params.noteId;
  return <Editor noteId={noteId} />;
};

export default NotePage;