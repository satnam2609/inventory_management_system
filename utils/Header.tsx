"use client";

 

export default function Header({ text, description, full, x, y }:{text:string,description:string,full:boolean,x:number,y:number}) {
  return (
    <div className={`${full ? "w-full" : ""} px-${x} py-${y}" flex flex-col items-start gap-3`}>
      <p className="text-3xl font-bold">
        {text}
      </p>
      <p className="text-xl font-medium text-[#0a0a0a71]">{description}</p>
    </div>
  );
}