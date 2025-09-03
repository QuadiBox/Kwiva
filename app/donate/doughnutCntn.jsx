'use client'

import React, { useEffect, useState } from 'react'
import DoughnutChart from './doughnut'

// Firebase imports (adjust based on your setup)
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../db/FirebaseConfig'
import { PaystackButton } from 'react-paystack'
import LoveOverlay from './LoveOverlay'
import { updateDocument } from '../db/firestoreService'

const DoughnutCntn = () => {
    const [size, setSize] = useState(140)
    const [strokeWidth, setStrokeWidth] = useState(12)
    const [raised, setRaised] = useState(0)
    const [target, setTarget] = useState(130000)
    const [amount, setAmount] = useState('')
    const [showBubbles, setShowBubbles] = useState(false)


    useEffect(() => {
        // Responsive handler
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768
            setSize(isMobile ? 140 : 200)
            setStrokeWidth(isMobile ? 12 : 20)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const docRef = doc(db, 'winners', 'donations')
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    if (data.raised !== undefined) setRaised(data.raised)
                    if (data.target !== undefined) setTarget(data.target)
                } else {
                    console.log('No such document!')
                }
            } catch (error) {
                console.error('Error fetching donations:', error)
            }
        }

        fetchDonationData()
    }, [])


    const handleChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '') // remove non-numeric characters
        const numericValue = raw === '' ? '' : parseInt(raw)
        setAmount(numericValue)
    }

    const formatted = amount === '' ? '' : `₦${amount.toLocaleString('en-NG')}`;


    //paystack widget configuration
    const config = {
        reference: (new Date()).getTime().toString(),
        email: `kwivaonline@gmail.com`,
        amount: parseInt(amount || 0) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        // publicKey: 'pk_test_680463a03d8cd455d731195ceb8835ce288d94e9',
        publicKey: 'pk_live_b4ad860c0e165c9aed219483f3f7aa528f537234',
    };

    //action for when the paystack widget payment goes through successfully
    const handlePaystackSuccessAction = async (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        await handleRequestProcessAfterPayment();
    };

    // you can call this function anything
    const handlePaystackCloseAction = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    }

    const componentProps = {
        ...config,
        text: 'Donate',
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    };


    const handleRequestProcessAfterPayment = async () => {

        try {
            setShowBubbles(true);
            updateDocument("winners", "donations", {raised: raised + parseInt(amount)})
            setRaised(prev => prev + parseInt(amount));
            setAmount("");
            setTimeout(() => {
                setShowBubbles(false);
            }, 25000);
        } catch (err) {
            console.error(err)
        }

    };

    return (
        <div className='doughnutCntn'>
            <DoughnutChart
                raised={raised}
                target={target}
                size={size}
                strokeWidth={strokeWidth}
                color="#000"
                bgColor="#fff"
                animationDuration={1800}
            />
            <div className='donationForm'>
                <h2>Donate here with love💖👇 </h2>
                <div className="amountInputCntn">
                    <label htmlFor="donationAmount"><b>Donation Amount:</b></label>
                    <input
                        id="donationAmount"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formatted}
                        onChange={handleChange}
                        placeholder="₦0"
                        className={"donationAmountInput"}
                    />
                </div>
                {/* <PaystackButton {...componentProps}></PaystackButton> */}
            </div>
            <LoveOverlay showBubbles={showBubbles}></LoveOverlay>
        </div>
    )
}

export default DoughnutCntn
