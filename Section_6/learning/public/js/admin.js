import { displayFlashMessage } from "./flash-messages.js";

const deleteProduct = async (btn) => {
  try {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrfToken = btn.parentNode.querySelector("[name=csrfToken]").value;

    const productElement = btn.closest("article");

    const response = await fetch(`/admin/product/${productId}`, {
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

window.deleteProduct = deleteProduct;
