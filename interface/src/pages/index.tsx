import NextHead from "next/head";
import Image from "next/image";
import qhLogo from "../../public/qh logo.png";
import { Fragment, useState } from "react";
import { create } from "zustand";
import { v4 } from "uuid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import tailwindConfig from "../../tailwind.config";
import { Dialog, Transition } from "@headlessui/react";
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Heading,
  Hr,
  Html,
  Head,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

type Show = {
  uuid: string;
  date: string;
  title: string;
  description: string;
  ticketLink: string;
  image: string;
};

type Email = {
  subject: string;
  shows?: Show[];
};

type Action = {
  addShow: (show: Show) => void;
  updateShow: (show: Show) => void;
  removeShow: (show: Show) => void;
  updateSubject: (subject: string) => void;
};

const useStore = create<Email & Action>((set) => ({
  subject:
    "What's On " +
    new Date().toLocaleDateString("en-GB", {
      month: "long",
    }),
  addShow: (show) =>
    set((state) => ({
      ...state,
      shows: [...(state.shows ?? []), show],
    })),
  updateShow: (show) =>
    set((state) => ({
      ...state,
      shows: state.shows?.map((s) => (s.uuid === show.uuid ? show : s)),
    })),
  removeShow: (show) =>
    set((state) => ({
      ...state,
      shows: state.shows?.filter((s) => s.uuid !== show.uuid),
    })),
  updateSubject: (subject) =>
    set((state) => ({
      ...state,
      subject,
    })),
}));

const { addShow, updateShow, removeShow, updateSubject } = useStore.getState();

const Home = () => {
  return (
    <>
      <NextHead>
        <title>QH Email Creator</title>
        <meta name="description" content="QH Email Creator" />
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <div className="flex h-screen w-screen flex-row">
        <SideBar />
        <main className="flex-1">
          <EmailRenderer />
        </main>
      </div>
    </>
  );
};

export default Home;

const SideBar: React.FC = () => {
  const [parent] = useAutoAnimate();
  const [isOpen, setOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <div className="flex h-full w-max flex-col gap-2 bg-stiletto-700 px-8 py-4">
      <Image src={qhLogo} alt="Queens Hall logo" height={110} priority />
      <span className="mt-2 border-b-2 border-white" />
      <input
        className="border-white bg-transparent text-center text-xl font-bold tracking-tight text-white focus:border-b-2 focus:outline-none"
        placeholder="Email Subject"
        type="text"
        value={useStore((state) => state.subject)}
        onChange={(e) => updateSubject(e.target.value)}
      />
      <div
        className="scrollbar-hide flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-clip"
        ref={parent}
      >
        {useStore(
          (state) =>
            state.shows?.map((show) => (
              <ShowEditor key={show.uuid} show={show} />
            )),
        )}
        <span className="flex justify-center">
          <AddIcon
            onClick={() =>
              addShow({
                uuid: v4(),
                date: "",
                title: "",
                description: "",
                ticketLink: "",
                image: "",
              })
            }
          />
        </span>
      </div>
      <button
        className="rounded bg-white px-4 py-2 font-bold text-stiletto-700"
        onClick={openModal}
      >
        Send Email
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Who are we sending this to?
                  </Dialog.Title>
                  <div className="mt-2">
                    {/* <textarea
                      className="text mt-5 block h-40 w-full max-w-full rounded-md border-gray-300 text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stiletto-500 sm:text-sm"
                      placeholder="fake@gmail.com,fake@gmail.com"
                    /> */}
                    <input
                      type="email"
                      className="text mt-5 block w-full max-w-full rounded-md border-gray-300 text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stiletto-500 sm:text-sm"
                      onChange={(e) => setEmailAddress(e.target.value)}
                      value={emailAddress}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-stiletto-100 px-4 py-2 text-sm font-medium text-stiletto-900 hover:bg-stiletto-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stiletto-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                        const email = useStore.getState();
                        const a = render(<EmailComponent email={email} />);
                        const response = fetch(
                          "https://react.email/api/send/test",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              to: emailAddress,
                              subject: email.subject,
                              html: a,
                            }),
                          },
                        );
                      }}
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                        const email = useStore.getState();
                        const a = render(<EmailComponent email={email} />);
                        async () => await navigator.clipboard.writeText(a);
                      }}
                    >
                      Copy HTML
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <h4 className="text-center text-xs text-white">
        © William Stoneham 2023
      </h4>
    </div>
  );
};

const AddIcon: React.FC<{ onClick?: React.MouseEventHandler }> = ({
  onClick,
  ...props
}) => {
  return (
    <svg
      className="slate-600 hover:slate-800 aspect-square w-10 cursor-pointer text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      onClick={onClick}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      ></path>
    </svg>
  );
};

const ShowEditor: React.FC<{ show: Show }> = ({ show, ...props }) => {
  return (
    <div
      className="h-max w-full flex-row gap-2 border-b-2 border-white text-white"
      {...props}
    >
      <span className="my-2 flex justify-between">
        {/* <input className="flex-1 cursor-text bg-transparent font-semibold focus:bg-transparent focus:outline-none" /> */}
        <input
          className="w-10 flex-1 cursor-text border-white bg-transparent text-xl font-extrabold text-white hover:text-gray-200 focus:bg-transparent focus:outline-none"
          placeholder="Example show"
          value={show.title}
          onChange={(e) => {
            updateShow({ ...show, title: e.target.value });
          }}
        />
        <span
          className="aspect-square h-5 cursor-pointer"
          onClick={() => removeShow({ ...show })}
        >
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
          value={show.date}
          onChange={(e) => {
            updateShow({ ...show, date: e.target.value });
          }}
        />
      </span>
      <span className="my-2 flex gap-2">
        <p>Ticket Link:</p>
        <input
          type="url"
          className="flex-1 cursor-text border-white bg-transparent focus:border-b-2 focus:outline-none"
          placeholder="https://example.com"
          value={show.ticketLink}
          onChange={(e) => {
            updateShow({ ...show, ticketLink: e.target.value });
          }}
        />
      </span>
      <span className="my-2 flex gap-2">
        <p>Image url:</p>
        <input
          type="url"
          placeholder="https://example.com/image.png"
          className="flex-1 cursor-text border-white bg-transparent focus:border-b-2 focus:outline-none"
          value={show.image}
          onChange={(e) => {
            updateShow({ ...show, image: e.target.value });
          }}
        />
      </span>
      <span>
        <textarea
          className="w-full bg-transparent focus:outline-none"
          placeholder="description"
          value={show.description}
          onChange={(e) => {
            updateShow({ ...show, description: e.target.value });
          }}
        />
      </span>
      <input type="file" className="hidden" />
    </div>
  );
};

const baseUrl = "https://qh-react-email.vercel.app";

export const EmailComponent: React.FC<{ email: Email }> = ({ email }) => {
  // get email subject from store
  const { subject, shows } = email;
  const logoHeight = 80;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecnFHGPezSQ.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{subject}</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="h-max gap-5 p-10">
            <Section className="bg-stiletto-700 p-5">
              <Img
                className="mx-auto"
                alt="Queens Hall logo"
                src={`${baseUrl}/qh%20logo.png`}
                width={logoHeight * 2.5553539}
                height={logoHeight}
              />
              <Heading className="text-center font-semibold text-white">
                {subject}
              </Heading>
            </Section>
            {shows?.map((show) => {
              return (
                <Section key={show.uuid} id={show.uuid}>
                  <Hr />
                  <Section className="p-5">
                    <Row>
                      <Img
                        className="w-full"
                        alt={
                          show.title +
                          " Poster " +
                          new Date(show.date).toLocaleDateString("en-GB")
                        }
                        src={
                          show.image === ""
                            ? `${baseUrl}/qh%20noImg.png`
                            : show.image
                        }
                      />
                    </Row>
                    <Row>
                      <Column className="w-1/2">
                        <Heading className="text-slate-700">
                          {show.title}
                        </Heading>
                        <Text className="text-slate-700 antialiased">
                          {show.description}
                        </Text>
                      </Column>
                      <Column className="w-1/2 text-center">
                        <Text className="text-lg font-medium text-slate-700">
                          {new Date(show.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                        <Button
                          className="bg-QHgold px-5 py-4 text-xl font-bold text-stiletto-50"
                          href={show.ticketLink}
                        >
                          Book Tickets
                        </Button>
                      </Column>
                    </Row>
                  </Section>
                </Section>
              );
            })}
            <Section className="bg-stiletto-700 p-5">
              <Text className="text-center text-white">
                Queens Hall Theatre, Waterloo Road, Cranbrook, Kent, TN17 3JD
              </Text>
              <Text className="text-center text-white">
                Box Office:{" "}
                <Link href="tel:01580711800" className="text-white">
                  01580 711800
                </Link>
              </Text>
              <Text className="text-center text-white">
                Website:{" "}
                <Link
                  href="https://queenshalltheatre.co.uk"
                  className="text-white"
                >
                  https://queenshalltheatre.co.uk
                </Link>
              </Text>
              <Text className="text-center text-white">
                Not interested anymore?{" "}
                <Link
                  href="mailto:Hulland-RumleyK@cranbrook.kent.sch.uk?subject=Unsubscribe%20From%20Queens%20Hall%20Theatre%20Newletter&body=Dear%20Kester%20Hulland-Rumley%0D%0A%0D%0AI%20would%20kindly%20like%20to%20ask%20for%20this%20email%20to%20be%20removed%20from%20the%20Queens%20Hall%20Theatre%20Mailing%20List.%0D%0A%0D%0AKind%20regards%0D%0ACustomer"
                  className="text-white"
                >
                  Unsubscribe
                </Link>
              </Text>
              <Text className="text-center text-white">
                © Queens Hall Theatre{" "}
                {new Date().toLocaleDateString("en-GB", {
                  year: "numeric",
                })}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const EmailRenderer: React.FC = () => {
  // reload this component when the store changes
  const store = useStore();
  const a = render(<EmailComponent email={store} />);
  return <iframe srcDoc={a} className="h-full w-full" />;
};
