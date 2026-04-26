import { useState } from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight } from 'lucide-react';

export default function ContactSection() {
  const { addMessage } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const [formData, setFormData] = useState({
    sender_name: '',
    phone_number: '',
    sender_email: '',
    subject: '',
    message_body: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being typed in
    if (name === 'sender_email' && errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    if (name === 'phone_number' && errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    // Validation
    const newErrors: { email?: string; phone?: string } = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.sender_email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone number validation: if filled, must be exactly 10 digits
    // We optionally strip spaces/dashes before checking, but strict 10-digit requirement means 
    // we just check if it contains exactly 10 digits.
    if (formData.phone_number && formData.phone_number.trim() !== '') {
      const cleanPhone = formData.phone_number.replace(/[\s-()]/g, '');
      if (!/^\d{10}$/.test(cleanPhone)) {
        newErrors.phone = 'Phone number must be exactly 10 digits.';
      } else {
        // Automatically sanitize it for the database submission
        formData.phone_number = cleanPhone;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      await addMessage({
        ...formData,
        is_read: false
      });
      setIsSuccess(true);
      setFormData({
        sender_name: '',
        phone_number: '',
        sender_email: '',
        subject: '',
        message_body: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-[clamp(3rem,8vw,20rem)] bg-white border-t border-gray-100">
      <div className="container mx-auto px-[clamp(1rem,3vw,12rem)] max-w-[clamp(40rem,60vw,120rem)]">
        <div className="flex justify-center text-center mb-[clamp(2rem,6vw,16rem)]">
          <h2 className="text-[clamp(2.5rem,5vw,10rem)] font-heading font-black text-uhs-maroon uppercase tracking-tight relative group inline-block cursor-pointer transition-transform duration-300 hover:-translate-y-2">
            ENQUIRY FORM
            <span className="absolute -bottom-2 left-0 w-full h-[clamp(4px,0.5vw,12px)] bg-uhs-maroon scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-left"></span>
          </h2>
        </div>

        {isSuccess && (
          <div className="mb-[clamp(1.5rem,3vw,8rem)] p-[clamp(1rem,2vw,4rem)] bg-green-50 text-green-800 border border-green-200 rounded-lg text-[clamp(1rem,1.5vw,3rem)]">
            Thank you for your enquiry. We will get back to you shortly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[clamp(2rem,4vw,12rem)]">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="sender_name"
              id="sender_name"
              required
              value={formData.sender_name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full pb-[clamp(1rem,1.5vw,3rem)] bg-transparent border-b border-uhs-maroon/30 focus:border-uhs-maroon text-[clamp(1rem,1.5vw,3rem)] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-300"
            />
          </div>

          {/* Phone Field */}
          <div className="relative">
            <input
              type="tel"
              name="phone_number"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone"
              className={`w-full pb-[clamp(1rem,1.5vw,3rem)] bg-transparent border-b ${errors.phone ? 'border-red-500' : 'border-uhs-maroon/30'} focus:border-uhs-maroon text-[clamp(1rem,1.5vw,3rem)] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-300`}
            />
            {errors.phone && <p className="text-red-500 text-[clamp(0.75rem,1vw,2rem)] mt-1 absolute -bottom-[clamp(1rem,1.5vw,3rem)]">{errors.phone}</p>}
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="sender_email"
              id="sender_email"
              required
              value={formData.sender_email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full pb-[clamp(1rem,1.5vw,3rem)] bg-transparent border-b ${errors.email ? 'border-red-500' : 'border-uhs-maroon/30'} focus:border-uhs-maroon text-[clamp(1rem,1.5vw,3rem)] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-300`}
            />
            {errors.email && <p className="text-red-500 text-[clamp(0.75rem,1vw,2rem)] mt-1 absolute -bottom-[clamp(1rem,1.5vw,3rem)]">{errors.email}</p>}
          </div>

          {/* Subject Field (Required by DB) */}
          <div className="relative">
            <input
              type="text"
              name="subject"
              id="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full pb-[clamp(1rem,1.5vw,3rem)] bg-transparent border-b border-uhs-maroon/30 focus:border-uhs-maroon text-[clamp(1rem,1.5vw,3rem)] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-300"
            />
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              name="message_body"
              id="message_body"
              required
              rows={1}
              value={formData.message_body}
              onChange={handleChange}
              placeholder="Message"
              className="w-full pb-[clamp(1rem,1.5vw,3rem)] bg-transparent border-b border-uhs-maroon/30 focus:border-uhs-maroon text-[clamp(1rem,1.5vw,3rem)] text-gray-800 placeholder-gray-400 outline-none transition-colors duration-300 resize-y min-h-[clamp(2.5rem,4vw,8rem)]"
            />
            <div className="absolute bottom-1 right-0 pointer-events-none opacity-30">
              {/* Little diagonal lines for resize handle hint visually matching the screenshot */}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L1 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <path d="M9 5L5 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-[clamp(1rem,2vw,6rem)]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center px-[clamp(1.5rem,3vw,8rem)] py-[clamp(0.75rem,1.5vw,4rem)] rounded-full border-[clamp(1px,0.2vw,4px)] border-uhs-maroon text-uhs-maroon font-medium hover:bg-uhs-maroon hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-[clamp(1rem,1.5vw,3rem)] mr-[clamp(0.5rem,1vw,2rem)]">{isSubmitting ? 'Sending...' : 'Submit'}</span>
              {!isSubmitting && <ArrowRight className="w-[clamp(1.25rem,2vw,4rem)] h-[clamp(1.25rem,2vw,4rem)] transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
