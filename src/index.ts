import "./style.css";
import { z } from "zod";

const ContactFormSchema = z.object({
  firstName: z.string().min(1, { message: "This field is required" }),
  lastName: z.string().min(1, { message: "This field is required" }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email({ message: "Please enter a valid email address" }),
  queryType: z.enum(["GENERAL_ENQUIRE", "SUPPORT_REQUEST"], {
    errorMap: () => ({ message: "Please select a query type" }),
  }),
  message: z.string().min(1, { message: "This field is required" }),
  consent: z.boolean().refine((val) => val === true, {
    message: "To submit this form, please consent to being contacted",
  }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector<HTMLFormElement>("form.contact-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data: ContactFormData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        queryType: formData.get("queryType") as
          | "GENERAL_ENQUIRE"
          | "SUPPORT_REQUEST",
        message: formData.get("message") as string,
        consent: formData.get("consent") === "on",
      };

      // Validate data
      const result = ContactFormSchema.safeParse(data);

      if (result.success) {
        showNotification();
        console.log("Valid contact form data:", result.data);

        // clear form data
        form.reset();
      } else {
        console.error("Validation errors:", result.error.errors);
        displayErrors(result.error.errors);
      }
    });

    // Clear error messages on input change
    form
      .querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")
      .forEach((input) => {
        input.addEventListener("input", () => {
          const notifyElement = document.querySelector<HTMLElement>(
            `.${input.name}-notify`
          );
          if (notifyElement) {
            notifyElement.textContent = "";
          }
        });
      });
  }
});

function displayErrors(errors: z.ZodIssue[]) {
  errors.forEach((error) => {
    const fieldName = error.path[0] as string;
    const errorMessage = error.message;

    const inputElement = document.querySelector<HTMLElement>(
      `.${fieldName}-notify`
    );
    if (inputElement) {
      inputElement.textContent = errorMessage;
    }
  });
}

function showNotification() {
  const notificationElement = document.querySelector(".notification");

  if (notificationElement) {
    notificationElement.classList.add("show");

    setTimeout(() => {
      notificationElement.classList.remove("show");
    }, 3000);
  }
}
