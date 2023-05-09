export default function Playground() {
  return (
    <div>
      <div className="text-2xl">Input</div>
      <div className="grid gap-2 border p-10 md:grid-cols-2">
        <div className="col-span-1">
          <div className="border border-black">schema</div>
          <div className="border border-black py-2">
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              <div className="col-span-3 border border-black md:justify-self-end">
                label1
              </div>
              <div className="col-span-2 border border-black">input1</div>
              <div className="col-span-1 border border-black">range1</div>
              <div className="col-span-3 border border-black md:justify-self-end">
                label2
              </div>
              <div className="col-span-1 border border-black">input2</div>
              <div className="col-span-1"></div>
              <div className="col-span-3 border border-black md:justify-self-end">
                label3
              </div>
              <div className="col-span-2 border border-black">input3</div>
              <div className="col-span-1 border border-black">range3</div>
              <div className="col-start-1 justify-self-start border border-black">
                Button1
              </div>
              <div className="col-start-3 justify-self-end border md:col-start-6">
                Button2
              </div>
            </div>
          </div>
        </div>
        <div className="border border-black">chartjs</div>
      </div>
      <div className="col-span-2 border border-black">candidates</div>
      <div className="text-2xl">Applications</div>
      <div className="grid gap-2 border p-10 md:grid-cols-4">
        <div className="border border-black">
          <div>Image</div>
          <div>Title</div>
          <div>Text</div>
          <div className="mx-2 flex justify-end">
            <div className="">Button1</div>
            <div className="">Button2</div>
          </div>
        </div>
        <div className="border border-black">other</div>
      </div>
    </div>
  );
}
