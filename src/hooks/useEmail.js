import emailjs from 'emailjs-com'
import { toast } from 'react-hot-toast'

const SERVICE_ID = 'service_xi41c76'
const TEMPLATE_ID = 'template_0cka22w'
const PUBLIC_KEY = '1vHIR5EeA2ntsBfz4'

export const useEmail = () => {
  const sendEmail = async (formValues) => {
    try {
      const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, formValues, PUBLIC_KEY)
      toast.success('Email sent successfully!')
      console.log(result.text)
      return true
    } catch (error) {
      toast.error('Failed to send email.')
      console.error('EmailJS Error:', error)
      return false
    }
  }

  return { sendEmail }
}
