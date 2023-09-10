import Head from "next/head";
import Image from "next/image";
import qhLogo from "../../public/qh logo.png";
import React, { useState } from "react";

type Show = {
  date: string;
  title: string;
  description: string;
  ticketLink: string;
};

type Email = {
  subject: string;
  shows?: Show[];
};

export default function Home() {
  const email: Email = {
    subject: "Queens Hall Presents:",
  };
  const [emailJSON, setEmailJson] = useState(email);
  const setEmailJSON = (newEmailJSON: Email) => {
    setEmailJson(newEmailJSON);
  };
  return (
    <>
      <Head>
        <title>QH Email Creator</title>
        <meta name="description" content="QH Email Creator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen flex-row">
        <SideBar emailJSON={emailJSON} setEmailJSON={setEmailJSON} />
        <main className="flex min-h-screen flex-col"></main>
      </div>
    </>
  );
}

const SideBar: React.FC<{
  emailJSON: Email;
  setEmailJSON: (newEmailJSON: Email) => void;
}> = ({ emailJSON, setEmailJSON }) => {
  return (
    <div className="flex h-full w-1/4 flex-col gap-2 bg-stiletto-700 px-8 py-4">
      <Image src={qhLogo} alt="Queens Hall logo" height={110} />
      <span className="mt-2 border-b-2 border-white" />
      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
        <ShowEditor />
        <AddIcon emailJSON={emailJSON} setEmailJSON={setEmailJSON} />
      </div>
      <h4 className="text-center text-xs text-white">
        © William Stoneham 2023
      </h4>
    </div>
  );
};

const AddIcon: React.FC<{
  emailJSON: Email;
  setEmailJSON: (newEmailJSON: Email) => void;
}> = (emailJSON, setEmailJSON) => {
  return (
    <span className="relative flex justify-center">
      <svg
        className="slate-600 hover:slate-800 aspect-square w-10 cursor-pointer text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
    </span>
  );
};

const ShowEditor = () => {
  return (
    <div className="h-max w-full flex-row gap-2 border-b-2 border-white text-white">
      <span className="my-2 flex justify-between">
        {/* <input className="flex-1 cursor-text bg-transparent font-semibold focus:bg-transparent focus:outline-none" /> */}
        <input
          className="w-10 flex-1 cursor-text border-white bg-transparent text-xl font-extrabold text-white hover:text-gray-200 focus:bg-transparent focus:outline-none"
          placeholder="example show"
        />
        <span className="aspect-square h-5 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </span>
      </span>
      <span className="my-2 flex gap-2">
        <p>Date:</p>
        <input
          type="date"
          className="flex-1 cursor-text border-white bg-transparent focus:border-b-2 focus:outline-none"
        />
      </span>
      <span className="my-2 flex gap-2">
        <p>Ticket Link:</p>
        <input
          type="url"
          className="flex-1 cursor-text border-white bg-transparent focus:border-b-2 focus:outline-none"
          placeholder="https://example.com"
        />
      </span>
      <span>
        <textarea
          className="w-full bg-transparent focus:outline-none"
          placeholder="description"
        />
      </span>
      <input type="file" className="hidden" />
    </div>
  );
};
