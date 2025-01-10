import { Metadata } from "next";
import Editor from "./editor";
import { use } from "react";

const title = 'Later';
const description = 'My application.';

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