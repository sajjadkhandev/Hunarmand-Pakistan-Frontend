import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Karachi',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Kya Hunarmand Pakistan par register hone ki koi fees hai?',
      a: 'Nahi! Customer aur Worker dono ke liye registration bilkul MUFT (Free) hai. Koi chuppay huay charges nahi hain.',
    },
    {
      q: 'Worker ko verified kaise banaya jata hai?',
      a: 'Worker registration ke baad apna CNIC aur tajurba (experience) submit karta hai. Admin team tasdeeq ke baad profile par "Verified" badge lagati hai.',
    },
    {
      q: 'Agar worker kaam theek na kare to kya kiya jaye?',
      a: 'Aap system mein Report button ke zariye complaint darj kar sakte hain aur review mein rating de sakte hain. Hamari support team fori rabta karegi.',
    },
    {
      q: 'Payment kaise hoti hai?',
      a: 'Kaam mukammal hone ke baad customer direct worker ko cash ya online transfer (JazzCash / EasyPaisa / Bank) ke zariye payment karta hai.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Rabta Karein (Contact Support)
        </h1>
        <p className="text-sm text-slate-600">
          Agar aapko kisi worker se mutalliq madad chahiye ya feedback dena chahein, hum haazir hain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Shukriya! Paigham Wasool Ho Gaya</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Aapka message hamari support team ko pohanch chuka hai. Hum jald aap ke number ya email par rabta karenge.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition"
              >
                Naya Message Bhejein
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hamein Message Bhejein</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Naam</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Muhammad Bilal"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="bilal@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Mobile No.</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03001234567"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Shehar (City)</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option>Karachi</option>
                    <option>Lahore</option>
                    <option>Islamabad</option>
                    <option>Rawalpindi</option>
                    <option>Peshawar</option>
                    <option>D.I. Khan</option>
                    <option>Faisalabad</option>
                    <option>Multan</option>
                    <option>Quetta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option>General Inquiry</option>
                  <option>Worker Verification Sawal</option>
                  <option>Customer Complaint / Report</option>
                  <option>Partnership & Franchise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Apna masla ya tajweez yahan likhein..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Message Bhejein</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="text-xl font-bold">Helpline & Direct Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subah 9:00 AM se Shaam 9:00 PM tak hamare numaish-karan aapki rahnumai ke liye tayar hain.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-300 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Phone Support</span>
                  <a href="tel:03069122770" className="text-sm font-bold text-white hover:text-emerald-400 transition">0306-9122770</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">WhatsApp Helpline</span>
                  <a
                    href="https://wa.me/923069122770?text=Assalam-o-Alaikum%20Hunarmand%20Pakistan!%20Mujhe%20madad%20chahiye."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-300 hover:underline"
                  >
                    +92 306 9122770
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-300 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Email Inquiries</span>
                  <span className="text-sm font-bold text-white">support@hunarmand.pk</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Head Office</span>
                  <span className="text-xs text-slate-300">Shahrah-e-Faisal, Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ summary */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              Aam Sawalaat (FAQ)
            </h4>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-2">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-emerald-700 py-1"
                  >
                    <span>{faq.q}</span>
                    {activeFaq === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {activeFaq === i && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
