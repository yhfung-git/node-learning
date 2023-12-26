exports.getPaginationInfo = async (page, itemPerPage, model) => {
  try {
    const totalItems = await model.countDocuments();
    const totalPages = Math.ceil(totalItems / itemPerPage);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page * itemPerPage < totalItems,
      previousPage: page - 1,
      nextPage: page + 1,
    };

    return paginationInfo;
  } catch (err) {
    throw err;
  }
};
