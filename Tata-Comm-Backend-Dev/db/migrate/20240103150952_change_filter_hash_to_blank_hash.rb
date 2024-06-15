class ChangeFilterHashToBlankHash < ActiveRecord::Migration[6.1]
  def up
    change_blank_hash(nil, {})
    change_column_default :segment_filters, :filter_hash, from: nil, to: {}
  end

  def down
    change_blank_hash({}, nil)
    change_column_default :segment_filters, :filter_hash, from: {}, to: nil
  end

  def change_blank_hash(value1, value2)
    sfs = SegmentFilter.where(filter_hash: value1)
    sfs.update_all(filter_hash: value2)
  end
end
