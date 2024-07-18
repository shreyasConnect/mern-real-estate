import React, { useState } from 'react';

const PricingPlan = () => {
    const [selectedPlan, setSelectedPlan] = useState('Monthly');
    const [amount, setAmount] = useState(349);

    const handlePlanChange = (plan, price) => {
        setSelectedPlan(plan);
        setAmount(price);
    };

    const checkoutHandler = async (plan, amount) => {
        setAmount(amount);
        const key = await fetch("/api/payment/getkey");
        const dataKey = await key.json();
        console.log("Key:", dataKey)

        const order = await fetch(`/api/payment/checkout/${amount}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const orderData = await order.json();
        console.log("Order:", orderData);

        const options = {
            dataKey,
            amount: orderData.amount,
            currency: "INR",
            name: "Patil Developers",
            description: `Plan: ${plan}`,
            image: "../assets/patil-logo.png",
            order_id: orderData.id,
            callback_url: "/api/paymentverification",
            prefill: {
                name: "Shreyas Patil",
                email: "patilshreyas1803@gmail.com",
                contact: "9146920841"
            },
            notes: {
                "address": "Deshing, Kavathe Mahankal, Sangli-416410"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    }



    return (
        <div className="flex flex-col items-center justify-center py-12 ">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Choose a plan</h1>
                <p className="mt-4 text-gray-500">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis.</p>
            </div>

            <div className="mt-8 space-y-4">
                <div
                    className={`p-4 border rounded-lg cursor-pointer ${selectedPlan === 'Monthly' ? 'border-blue-500' : 'border-gray-300'}`}

                >
                    <input type="radio" id="Monthly" name="plan" value="Monthly" className="hidden" checked={selectedPlan === 'Monthly' && amount === 399} readOnly onClick={() => handlePlanChange('Monthly', 399)} />
                    <label htmlFor="Monthly" className="flex items-center cursor-pointer">
                        <div className="mr-4">
                            <div className="w-5 h-5 border border-gray-300 rounded-full flex justify-center items-center">
                                {selectedPlan === 'Monthly' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">₹399/month</p>
                            <p className="text-gray-500">Simple Monthly billing</p>
                        </div>
                    </label>
                </div>
                <div
                    className={`p-4 border rounded-lg cursor-pointer ${selectedPlan === 'SemiAnnually' ? 'border-blue-500' : 'border-gray-300'}`}

                >
                    <input type="radio" id="SemiAnnually" name="plan" value="SemiAnnually" className="hidden" checked={selectedPlan === 'SemiAnnually' && amount === 2094} readOnly onClick={() => handlePlanChange('SemiAnually', 2094)} />
                    <label htmlFor="SemiAnnually" className="flex items-center cursor-pointer">
                        <div className="mr-4">
                            <div className="w-5 h-5 border border-gray-300 rounded-full flex justify-center items-center">
                                {selectedPlan === 'SemiAnnually' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">₹349/month</p>
                            <p className="text-gray-500">2094 billed in a half year</p>
                        </div>
                        <div className="ml-auto bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-full">Save 12%</div>
                    </label>
                </div>

                <div
                    className={`p-4 border rounded-lg cursor-pointer ${selectedPlan === 'Annually' ? 'border-blue-500' : 'border-gray-300'}`}
                    onClick={() => setSelectedPlan('Annually')}
                >
                    <input type="radio" id="Annually" name="plan" value="Annually" className="hidden" checked={selectedPlan === 'Annually' && amount === 3588} readOnly onClick={() => handlePlanChange('Annually', 3588)} />
                    <label htmlFor="Annually" className="flex items-center cursor-pointer">
                        <div className="mr-4">
                            <div className="w-5 h-5 border border-gray-300 rounded-full flex justify-center items-center">
                                {selectedPlan === 'Annually' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">₹299/month</p>
                            <p className="text-gray-500">₹3588 billed in a year</p>
                        </div>
                        <div className="ml-auto bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded-full">Save 25%</div>
                    </label>
                </div>
            </div>

            <button onClick={() => checkoutHandler(selectedPlan, amount)} className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-8 rounded-full font-semibold">
                Checkout
            </button>
        </div>
    );
};

export default PricingPlan;
