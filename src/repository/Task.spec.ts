import connectToDatabase from "../../lib/connectToDatabase";

test("test", async () => {
  const { db } = await connectToDatabase();

  // @ts-ignore
  console.log(await db.collection("users").find().toArray());
});
