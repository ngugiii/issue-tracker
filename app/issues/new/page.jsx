"use client";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const page = () => {
   const {register, control,handleSubmit} =  useForm();
   const router = useRouter();

   const onSubmit = handleSubmit(async (data)=>{
    try{
        const response=await axios.post("/api/issues",data);
        router.push("/issues")
        toast.success("Issue Created");
    }
    catch(error){
        toast.error("Error Creating Issue");
    }
})
  return (
    <form className='max-w-xl space-y-3 flex flex-col' onSubmit={onSubmit}>
        <input type="text" required className='border outline-purple-600 rounded p-1' placeholder='Title' {...register("title")}/>
        <Controller
        name="description"
        control={control}
        render={({field})=><SimpleMDE placeholder='Description' id="" className='border required outline-purple-600 rounded p-1' {...field}/>
        }
        />
        <button className='bg-purple-600 md:w-[40%] hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors'>Submit New Issue</button>
    </form>
  )
}

export default page