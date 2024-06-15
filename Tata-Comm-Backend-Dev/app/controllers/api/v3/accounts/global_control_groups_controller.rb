class Api::V3::Accounts::GlobalControlGroupsController < Api::V1::Accounts::BaseController
  before_action :set_global_control_group, only: %i[show edit update destroy download_users_csv_file]

  # GET /api/v3/accounts/global_control_groups or /api/v3/accounts/global_control_groups.json
  def index
    @global_control_groups = GlobalControlGroup.all
  end

  # GET /api/v3/accounts/global_control_groups/1 or /api/v3/accounts/global_control_groups/1.json
  def show
  end

  # GET /api/v3/accounts/global_control_groups/new
  def new
    @global_control_group = GlobalControlGroup.new
  end

  # GET /api/v3/accounts/global_control_groups/1/edit
  def edit
  end

  # POST /api/v3/accounts/global_control_groups or /api/v3/accounts/global_control_groups.json
  def create
    @global_control_group = GlobalControlGroup.new(global_control_group_params.merge(account_id: Current.account.id))
    if @global_control_group.save!
      render json: { global_control_group: @global_control_group, message: "Control group was successfully created." }, status: :ok
    else
      render json: { message: @global_control_group.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v3/accounts/global_control_groups/1 or /api/v3/accounts/global_control_groups/1.json
  def update
    if @global_control_group.update!(global_control_group_params.merge(account_id: Current.account.id))
      @global_control_group.user_list_file.attach(global_control_group_params[:user_list_file]) if @global_control_group.upload_user_list?
      render json: { global_control_group: @global_control_group, message: "Control group updated successfully." }, status: :ok
    else
      render json: { message: @global_control_group.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v3/accounts/global_control_groups/1 or /api/v3/accounts/global_control_groups/1.json
  def destroy
    if @global_control_group.destroy
      render json: { global_control_group: @global_control_group, message: "Control group was successfully destroyed." }, status: :ok
    else
      render json: { message: "Unable to destroy." }, status: :unprocessable_entity
    end
  end

  # GET /api/v3/accounts/global_control_groups/download_users_csv_file or /api/v3/accounts/global_control_groups/download_users_csv_file.json
  def download_users_csv_file
    csv_data = @global_control_group.send("download_#{@global_control_group.control_group}_users") if @global_control_group.present?
    send_data csv_data, filename: 'global_control_group_users.csv', type: 'text/csv'
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_global_control_group
    @global_control_group = GlobalControlGroup.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def global_control_group_params
    params.require(:global_control_group).permit(:control_group, :random_allocation_percentage, :apply_global, :allow_marketers, :active,
                                                 :user_list_file)
  end
end
