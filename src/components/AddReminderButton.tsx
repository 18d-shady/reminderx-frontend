'use client';

import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import { useSubscription } from "@/lib/useSubscription";
import { useRouter } from "next/navigation";

const AddReminderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { plan } = useSubscription();

  const router = useRouter();

  const handleClick = () => {
    if (plan === "free" || plan === "premium") {
      // 🚀 Go straight to manual
      //window.location.href = "/documents/new";
      router.push('/documents/new');
    } else {
      // 🖼️ Show modal for multiuser / enterprise
      setIsOpen(true);
    }
  };

  return(
    <>
      <button onClick={handleClick}
        className="hidden lg:flex px-4 py-3 text-xs text-white bgg-main bgg-hover rounded-xl ">
         +Add Reminders
      </button>

      <button onClick={handleClick}
        className="lg:hidden p-2 text-white bgg-main bgg-hover rounded-full ">
         <svg className="h-5 w-5"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choose Addition Format"
        size="sm"
      >
        <div className="flex flex-col gap-3">
          <Link
            href="/documents/new"
            onClick={() => setIsOpen(false)}
            className="block w-full px-4 py-2 text-center rounded-md bgg-main text-white hover:bg-blue-600"
          >
            Add manually
          </Link>

          <Link
            href="/documents/excel"
            onClick={() => setIsOpen(false)}
            className="block w-full px-4 py-2 text-center rounded-md bg-white border bdd-main fff-main hover:bg-gray-100"
          >
            Add with excel document
          </Link>

        </div>
      </Modal>
    </>
  )
}

export default AddReminderButton;