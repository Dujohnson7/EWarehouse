/**
 * Simple Table Pagination Plugin
 * Usage: Add class "search-items" to table rows and call initTablePagination()
 */
function initTablePagination(options) {
  options = options || {};
  var currentPage = 1;
  var itemsPerPage = options.itemsPerPage || 10;
  var searchInputId = options.searchInputId || '#input-search';
  var rowClass = options.rowClass || '.search-items';
  var paginationId = options.paginationId || '#pagination';
  var itemsPerPageId = options.itemsPerPageId || '#itemsPerPage';
  var showingFromId = options.showingFromId || '#showingFrom';
  var showingToId = options.showingToId || '#showingTo';
  var totalItemsId = options.totalItemsId || '#totalItems';
  
  // Simple pagination function
  function showPage() {
    var visibleItems = $(rowClass + ':visible');
    var total = visibleItems.length;
    var totalPages = Math.ceil(total / itemsPerPage);
    
    // Hide all, then show current page items
    visibleItems.hide();
    var start = (currentPage - 1) * itemsPerPage;
    visibleItems.slice(start, start + itemsPerPage).show();
    
    // Update info
    var from = total === 0 ? 0 : start + 1;
    var to = Math.min(start + itemsPerPage, total);
    $(showingFromId).text(from);
    $(showingToId).text(to);
    $(totalItemsId).text(total);
    
    // Update pagination buttons
    var pagination = $(paginationId);
    pagination.empty();
    
    if (totalPages <= 1) return;
    
    // Previous
    pagination.append('<li class="page-item ' + (currentPage === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="prev">Previous</a></li>');
    
    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
      pagination.append('<li class="page-item ' + (i === currentPage ? 'active' : '') + '"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
    }
    
    // Next
    pagination.append('<li class="page-item ' + (currentPage === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" data-page="next">Next</a></li>');
  }
  
  // Items per page change
  $(itemsPerPageId).on('change', function() {
    itemsPerPage = parseInt($(this).val());
    currentPage = 1;
    showPage();
  });
  
  // Pagination click
  $(document).on('click', paginationId + ' .page-link', function(e) {
    e.preventDefault();
    var page = $(this).data('page');
    var totalPages = Math.ceil($(rowClass + ':visible').length / itemsPerPage);
    
    if (page === 'prev' && currentPage > 1) currentPage--;
    else if (page === 'next' && currentPage < totalPages) currentPage++;
    else if (typeof page === 'number') currentPage = page;
    
    showPage();
  });
  
  // Search functionality
  $(searchInputId).on('keyup', function() {
    var value = $(this).val().toLowerCase();
    currentPage = 1;
    
    $(rowClass).each(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
    
    showPage();
  });
  
  // Initialize
  showPage();
   
  return {
    refresh: function() {
      showPage();
    }
  };
}

