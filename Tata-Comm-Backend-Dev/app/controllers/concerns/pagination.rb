module Pagination
	extend ActiveSupport::Concern

	LIMIT_PER_PAGE = 20
	CURRENT_PAGE = 1

	def pagination_values(array_object)
		pagination = {
			current_page: array_object.current_page,
			prev_page: array_object.prev_page,
			next_page: array_object.next_page,
			total_pages: array_object.total_pages,
			limit_value: array_object.limit_value,
			total_count: array_object.total_count
		}
	end

end