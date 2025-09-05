"use client";

import React, { useState } from "react";
import { getPioneers } from "../utilFunctions";
import { getPioneerEmailHTML } from "../utilFunctions";
import { sendWelcomeEmail } from "@/app/email";

export default function SendWelcomeButton() {
    const [status, setStatus] = useState("Send Welcome Emails");

    const handleClick = async () => {
        try {
            setStatus("Initializing...");
            const pioneers = getPioneers();

            if (!Array.isArray(pioneers) || pioneers.length === 0) {
                setStatus("No pioneers found");
                return;
            }

            for (let i = 0; i < pioneers.length; i++) {
                const p = pioneers[i];
                setStatus(`Sending (${i + 1} of ${pioneers.length})`);
                const html = `${getPioneerEmailHTML(p.fullname)}`

                await sendWelcomeEmail(
                    '"Kwiva" <no-reply@kwiva.online>',
                    p.email,
                    "A note for our Pioneer Members 💌",
                    "A note for our Pioneer Members 💌",
                    html,
                );
            }

            setStatus(`Completed (${pioneers.length})`);
        } catch (err) {
            console.error(err);
            setStatus("Error sending emails");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="sendPioneerMailBtn"
        >
            {status}
        </button>
    );
}
