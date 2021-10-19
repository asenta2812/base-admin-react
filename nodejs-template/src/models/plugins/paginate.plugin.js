/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [query] - Query query
   * @param {string} [query.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [query.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [query.limit] - Maximum number of results per page (default = 10)
   * @param {number} [query.page] - Current page (default = 1)
   * @param {string} [query.select] - Select criteria using the format: 'id name'
   * @param {string} [query.filter] - Query criteria
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (query) {
    let sort = '';
    if (query.sortBy) {
      const sortingCriteria = [];
      query.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = '-createdAt';
    }

    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const page = query.page && parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;

    const filter = query.filter ? JSON.parse(query.filter) : {};
    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).select(query.select).sort(sort).skip(skip);
    if (limit > -1) {
      docsPromise = docsPromise.limit(limit);
    }

    if (query.populate) {
      query.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      // const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        total: totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
