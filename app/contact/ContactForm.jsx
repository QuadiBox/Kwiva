'use client'
import React, { useRef, useState, useEffect } from "react";
import { sendWelcomeEmail } from '../email';

const ContactForm = () => {

    const form = useRef(null);

    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        subject: "",
        body: ""
    });

    const [toggler, setToggler] = useState(false);
    const [loading, setLoading] = useState(false);

    const [mailStatus, setMailStatus] = useState({
        state: "normal",
        msg: "Message sent successfully!",
        active: false
    })

    const html_to_mail = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            max-width: 700px;
            width: 97%;
            margin: auto;
        }
        h2 {
            color: #C0BA82;
            text-transform: capitalize;
        }
        .field {
            margin-bottom: 10px;
        }
        .field p{
            font-size: 1.1em;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>A new message from ${formData.fName} ${formData?.lName}</h2>
        <div class="field">
            <span class="label">First Name:</span> <span>${formData.fName}</span>
        </div>
        <div class="field">
            <span class="label">Last Name:</span> <span>${formData.lName}</span>
        </div>
        <div class="field">
            <span class="label">Email:</span> <span>${formData.email}</span>
        </div>
        <div class="field">
            <span class="label">Message:</span>
            <p>${formData.body}</p>
        </div>
    </div>
</body>
</html>
`

    const sendEmail = async (e) => {
        e.preventDefault();


        try {
            setLoading(true)
            await sendWelcomeEmail(
                `"${formData.fName} from Kwiva." <${process.env.EMAIL_NAME}>`,
                'kwivaonline@gmail.com',
                formData.body,
                `${formData?.subject !== "" ? formData.subject : 'A New Contact Form Submission'}`,
                html_to_mail
            );
            setLoading(false);
            setMailStatus({
                state: "normal",
                msg: "Message sent successfully!",
                active: true
            })

            setToggler(prev => !prev);
        } catch (error) {
            setMailStatus({
                state: "rouge",
                msg: "Failed To send Message",
                active: true
            });
            setToggler(prev => !prev);
            console.error('Error handling user.created event:', err);
        }

        setFormData({
            fName: "",
            lName: "",
            email: "",
            subject: "",
            body: ""
        })
    };

    useEffect(() => {
        // Set up the timeout
        const timer = setTimeout(() => {
          setMailStatus(prev => ({...prev, active: false}));
        }, 3000); // 3000ms = 3 seconds
    
        // Cleanup function to clear the timeout
        return () => clearTimeout(timer);
    }, [toggler]); // Dependency array
    return (
        <div className="contactFormCntn">
            <form ref={form} onSubmit={sendEmail}>
                <div className="inputFields">
                    <input type="text" name="user_name" placeholder='Firstname' required value={formData.fName} onChange={(e) => {setFormData(prev => ({...prev, fName: e.target.value}))}}/>
                    <input type="text" placeholder='Lastname' required value={formData.lName} onChange={(e) => {setFormData(prev => ({...prev, lName: e.target.value}))}}/>
                    <input type="text" name="user_email" placeholder='Email' required value={formData.email} onChange={(e) => {setFormData(prev => ({...prev, email: e.target.value}))}}/>
                    <input type="text" placeholder='Subject' value={formData.subject} onChange={(e) => {setFormData(prev => ({...prev, subject: e.target.value}))}}/>
                </div>
                <textarea cols="30" rows="10" name="message" className='textarea' placeholder='Message' required value={formData.body} onChange={(e) => {setFormData(prev => ({...prev, body: e.target.value}))}}></textarea>
                <button type="submit" className='specBtn fillBtn'>{loading ? "Sending..." : "Send Message"}</button>
            </form>

            <div className={`toaster ${mailStatus.state === "rouge" ? "rouge": ""} ${mailStatus.active? "active": "inactive"}`}>
                Message sent successfully!
            </div>
        </div>
    )
}

export default ContactForm
