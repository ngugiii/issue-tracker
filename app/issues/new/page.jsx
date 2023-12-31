"use client";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/app/components/loader/Loader";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, control, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/issues", data);
      router.push("/issues");
      toast.success("Issue Created");
      setIsLoading(false);
    } catch (error) {
      toast.error("Error Creating Issue");
      setIsLoading(false);
    }
  });
  return (
    <>
      {isLoading && <Loader />}
      <form className="max-w-xl space-y-3 flex flex-col" onSubmit={onSubmit}>
        <input
          type="text"
          required
          className="border outline-purple-600 rounded p-1"
          placeholder="Title"
          {...register("title")}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE
              placeholder="Description"
              id=""
              className="border required outline-purple-600 rounded p-1"
              {...field}
            />
          )}
        />
        <button className="bg-purple-600 md:w-[40%] hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors">
          Submit New Issue
        </button>
      </form>
    </>
  );
};

export default Page;
