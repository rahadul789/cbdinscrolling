// TODO: Create a script to seed categories

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

const projectNames = [
  "Summary of Bd",
  "Current trend",
  "The rise of digital currecny",
];

async function main() {
  console.log("seeding projects");

  try {
    const values = projectNames.map((name) => ({
      name,
      description: `Chat related to ${name.toLowerCase}`,
    }));
    await db.insert(projects).values(values);
    console.log("Projects seeded successfully");
  } catch (error) {
    console.error("Error seeding projects", error);
    process.exit(1);
  }
}

main();

//ey script ta bun command diye run kore kintu node diye run korte gele onk jhanmela hoy tay ekhn korchi na
