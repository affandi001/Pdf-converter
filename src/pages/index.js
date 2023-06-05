import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import FileUpload from "@/components/file-uploader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="">
        <div className="pt-4">
          <h1 className="text-center text-3xl font-bold ">File converter</h1>
        </div>

        <div className="mt-10">
          <FileUpload />
        </div>
      </div>
    </>
  );
}
