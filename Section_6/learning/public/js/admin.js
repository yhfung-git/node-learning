const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=csrfToken]").value;

  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => console.log("Product deleted successfully:", result))
    .catch((err) => console.log("Error deleting product:", err));
};
