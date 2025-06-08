import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { Mail, Phone, MapPin, Send } from 'lucide-react';

    const ContactPage = () => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
      const [customOrderData, setCustomOrderData] = useState({ name: '', email: '', itemType: '', description: '', quantity: 1 });

      const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'contact') {
          setFormData(prev => ({ ...prev, [name]: value }));
        } else {
          setCustomOrderData(prev => ({ ...prev, [name]: value }));
        }
      };

      const handleSubmit = (e, formType) => {
        e.preventDefault();
        // In a real app, you'd send this data to a backend or email service
        // For now, we'll just show a toast notification
        if (formType === 'contact') {
          console.log('Contact Form Data:', formData);
          toast({
            title: "💌 Message Sent!",
            description: "Thanks for reaching out! We'll get back to you soon.",
            duration: 5000,
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          console.log('Custom Order Data:', customOrderData);
           toast({
            title: "✨ Custom Order Request Submitted!",
            description: "We've received your request and will be in touch to discuss the details!",
            duration: 5000,
          });
          setCustomOrderData({ name: '', email: '', itemType: '', description: '', quantity: 1 });
        }
      };

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 } },
      };

      const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      };
      
      const contactInfo = [
        { icon: <Mail size={24} className="text-pastel-dark" />, text: "hello@ccube.com", href: "mailto:hello@ccube.com" },
        { icon: <Phone size={24} className="text-pastel-dark" />, text: "(123) 456-7890", href: "tel:1234567890" },
        { icon: <MapPin size={24} className="text-pastel-dark" />, text: "123 Pastel Lane, Craftsville, CA 90210", href: "#" },
      ];

      return (
        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-fade-in"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-pastel-accent text-center mb-12">
            Custom Order
          </motion.h1>

          {/* Custom Orders Form Section */}
          <motion.section 
            id="custom-orders" 
            variants={itemVariants} 
            className="py-12 md:py-16 bg-gradient-to-br from-pastel-medium to-pastel-dark rounded-xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Dreaming of Something Special?</h2>
            <p className="text-lg text-white/90 text-center mb-10 max-w-2xl mx-auto">
              Let us craft a unique piece just for you! Fill out the form below with your ideas, and we'll get back to you to discuss the possibilities.
            </p>
            <form onSubmit={(e) => handleSubmit(e, 'customOrder')} className="space-y-6 max-w-xl mx-auto bg-pastel-light/80 p-8 rounded-lg shadow-inner">
               <div>
                <Label htmlFor="customName" className="text-pastel-accent/90">Full Name</Label>
                <Input type="text" name="name" id="customName" value={customOrderData.name} onChange={(e) => handleInputChange(e, 'customOrder')} required className="bg-white border-pastel-medium focus:border-pastel-dark focus:ring-pastel-dark" />
              </div>
              <div>
                <Label htmlFor="customEmail" className="text-pastel-accent/90">Email Address</Label>
                <Input type="email" name="email" id="customEmail" value={customOrderData.email} onChange={(e) => handleInputChange(e, 'customOrder')} required className="bg-white border-pastel-medium focus:border-pastel-dark focus:ring-pastel-dark" />
              </div>
              <div>
                <Label htmlFor="itemType" className="text-pastel-accent/90">Type of Item (e.g., Crochet Bag, Scented Candle)</Label>
                <Input type="text" name="itemType" id="itemType" value={customOrderData.itemType} onChange={(e) => handleInputChange(e, 'customOrder')} required placeholder="e.g., Crochet Amigurumi, Custom Scented Candle" className="bg-white border-pastel-medium focus:border-pastel-dark focus:ring-pastel-dark" />
              </div>
              <div>
                <Label htmlFor="description" className="text-pastel-accent/90">Describe Your Custom Request</Label>
                <Textarea name="description" id="description" rows={5} value={customOrderData.description} onChange={(e) => handleInputChange(e, 'customOrder')} required placeholder="Include details like colors, size, specific design ideas, etc." className="bg-white border-pastel-medium focus:border-pastel-dark focus:ring-pastel-dark" />
              </div>
               <div>
                <Label htmlFor="quantity" className="text-pastel-accent/90">Quantity</Label>
                <Input type="number" name="quantity" id="quantity" min="1" value={customOrderData.quantity} onChange={(e) => handleInputChange(e, 'customOrder')} required className="bg-white border-pastel-medium focus:border-pastel-dark focus:ring-pastel-dark" />
              </div>
              <Button type="submit" className="w-full bg-pastel-accent text-pastel-bg hover:bg-pastel-accent/90 shadow-md">
                Submit Custom Order Request
              </Button>
            </form>
          </motion.section>
        </motion.div>
      );
    };

    export default ContactPage;