import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import { PhoneOutlined, MailOutlined, MessageOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FaWhatsapp } from 'react-icons/fa6';

interface ContactSectionProps {
  contactInfo?: Record<string, string>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contactInfo = {} }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('hajj');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  const agencyPhone = contactInfo.phone || '+226 65 45 54 23';
  const agencyEmail = contactInfo.email || 'asemaouvoyage1448@gmail.com';
  const agencyAddress = contactInfo.address || "Avenue Kwamé N'Krumah, Ouagadougou, Burkina Faso";
  const whatsappNumber = contactInfo.whatsapp || '+2250749150769';

  const inputClass = "w-full bg-[#FDFBF7] text-[#1F2937] px-4 py-3.5 rounded-xl border border-[#E8E2D5] focus:border-[#2D5A4C] focus:ring-2 focus:ring-[#2D5A4C]/20 outline-none text-sm font-medium transition-all";

  return (
    <SectionWrapper id="contact" bgColor="light">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#B45309] text-[11px] font-bold uppercase tracking-[0.2em]">
          Contactez-nous
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A4C] tracking-tight mt-3">
          Une Question ? Parlons-en Ensemble
        </h2>
        <p className="mt-5 text-lg text-[#4B5563] font-light leading-relaxed">
          Nos conseillers sont disponibles pour répondre à toutes vos interrogations logistiques ou administratives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact details & Map (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-bold text-[#2D5A4C] mb-6">Coordonnées de l'Agence</h3>

            {/* Address */}
            <div className="flex gap-5">
              <span className="w-12 h-12 rounded-2xl bg-[#2D5A4C] flex items-center justify-center shrink-0 shadow-md">
                <EnvironmentOutlined className="text-[#FEF3C7] text-xl" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Adresse</span>
                <p className="text-[#1F2937] text-sm mt-1.5 font-semibold">{agencyAddress}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-5">
              <span className="w-12 h-12 rounded-2xl bg-[#2D5A4C] flex items-center justify-center shrink-0 shadow-md">
                <PhoneOutlined className="text-[#FEF3C7] text-xl" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Téléphone</span>
                <p className="text-[#1F2937] text-sm mt-1.5 font-semibold">
                  <a href={`tel:${agencyPhone}`} className="hover:text-[#2D5A4C] transition-colors">{agencyPhone}</a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5">
              <span className="w-12 h-12 rounded-2xl bg-[#2D5A4C] flex items-center justify-center shrink-0 shadow-md">
                <MailOutlined className="text-[#FEF3C7] text-xl" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">E-mail</span>
                <p className="text-[#1F2937] text-sm mt-1.5 font-semibold">
                  <a href={`mailto:${agencyEmail}`} className="hover:text-[#2D5A4C] transition-colors">{agencyEmail}</a>
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex gap-5">
              <span className="w-12 h-12 rounded-2xl bg-[#2D5A4C] flex items-center justify-center shrink-0 shadow-md">
                <FaWhatsapp className="text-[#FEF3C7] text-xl" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">WhatsApp</span>
                <p className="text-[#1F2937] text-sm mt-1.5 font-semibold">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2D5A4C] hover:text-[#B45309] transition-colors hover:underline"
                  >
                    Lien direct WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Map Integration */}
          <div className="rounded-3xl overflow-hidden shadow-sm h-64 border border-[#E8E2D5]">
            <iframe
              title="Google Map Agence Ouagadougou"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d3900.589886738981!2d-1.520443924167156!3d12.360299687903823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2db42838706d39%3A0xc3910c010d296213!2sAvenue%20Kwame%20N&#39;Krumah%2C%20Ouagadougou!5e0!3m2!1sfr!2sbf!4v1719266854508!5m2!1sfr!2sbf"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E8E2D5] rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-[#2D5A4C] mb-6">Envoyer un Message</h3>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#FEF3C7] text-[#B45309] p-8 rounded-2xl border border-[#B45309]/30 flex flex-col items-center text-center space-y-4"
              >
                <span className="text-5xl">✨</span>
                <h4 className="font-bold text-xl text-[#1F2937]">Message envoyé avec succès !</h4>
                <p className="text-sm text-[#4B5563] max-w-sm font-light">
                  Merci pour votre message. Nos conseillers spirituels et logistiques vous répondront par e-mail ou téléphone sous 24h.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary !px-6 !py-3 !text-xs cursor-pointer mt-2"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">Nom Complet</label>
                    <input
                      type="text" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Moussa Ouédraogo"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">N° de Téléphone</label>
                    <input
                      type="tel" required value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +226 70 12 34 56"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">Adresse E-mail</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: moussa@example.com"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">Objet de la Demande</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputClass + ' appearance-none cursor-pointer'}
                  >
                    <option value="hajj">Renseignements Hajj 2026</option>
                    <option value="omra">Renseignements Omra 2026</option>
                    <option value="devis">Demande de devis de groupe</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">Votre Message</label>
                  <textarea
                    required rows={5} value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Saisissez votre question ou demande ici..."
                    className={inputClass + ' resize-none'}
                  ></textarea>
                </div>

                {/* Submit Button (10% Accent Terre Cuite) */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full !py-4 !text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageOutlined className="text-base text-white" />
                  {submitting ? 'Envoi en cours...' : 'Envoyer ma Demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
