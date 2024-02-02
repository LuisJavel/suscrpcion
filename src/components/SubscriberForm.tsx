import { useRef, useState } from "react";
import toast, {Toaster}  from "react-hot-toast";
import validateEmail from "../lib/validateEmail";


const SubscriberForm = () => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSumit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(isSubmitting) return;
        setIsSubmitting(true);
        const subToast = toast.loading("Submitting..")

        const formData = new FormData(e.currentTarget)
        const formInputs = Object.fromEntries(formData)

        const email = formInputs.email

        if(!email){
            return toast.error("Porfavor no olvide su email gracias..",{
                id: subToast
            });
        }

        //validacion email
        if(!validateEmail((email as string).trim())){
            return toast.error("Porfavor esta valedo email gracias..",{
                id: subToast
            });
        }
        try {
            const res = await fetch("/api/subscribe.json", {
                method: "POST",
                body: JSON.stringify(formInputs),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
            if(!res.ok){
                throw new Error("Yikes")
            }
            const successMenssage = await res.json();
            toast.success(successMenssage.message, {
                id: subToast,
            })

            formRef.current?.reset();
            setIsSubmitting(false)
        } catch (e) {
            setIsSubmitting(false)
            toast.error("este tendras proble en la susbripcion", {
                id: subToast
                })
                if(e instanceof Error){
                    return console.error(e.message)
                }
                console.error(e)           
        }
    }
  return (
    <form ref={formRef} className="grid gap-2 p-4 border-2" onSubmit={handleSumit}>
        <label htmlFor="email">Ingrese tu correo email</label>
        <input type="email" name="email" id="email" required/>
        <button type="submit" disabled={isSubmitting}>Enviar</button>
        <Toaster />
    </form>
  )
}

export default SubscriberForm