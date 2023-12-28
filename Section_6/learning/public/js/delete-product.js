import { displayFlashMessage } from "./flash-messages.js";

const deleteProduct = async ({
  deleteUrl,
  productId,
  csrfToken,
  productElement,
}) => {
  try {
    const response = await fetch(`${deleteUrl}${productId}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      displayFlashMessage("error", result.error);
      throw new Error(`Error deleting product: ${response.status}`);
    }

    productElement.parentNode.removeChild(productElement);

    displayFlashMessage("success", result.message);
  } catch (err) {
    throw err;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((btn) => {
    const deleteUrl = btn.dataset.deleteUrl || "/";
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrfToken = btn.parentNode.querySelector("[name=csrfToken]").value;
    const productElement = btn.closest("article");

    btn.addEventListener("click", () => {
      deleteProduct({ deleteUrl, productId, csrfToken, productElement });
    });
  });
});
