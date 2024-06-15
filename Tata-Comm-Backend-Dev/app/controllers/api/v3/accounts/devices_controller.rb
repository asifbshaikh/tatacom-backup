class Api::V3::Accounts::DevicesController < Api::V1::Accounts::BaseController
  before_action :find_device, only: [:show]

  def show
    render json: @device, status: :ok
  end

  def create
    contact = Current.account.contacts.find(params[:device][:contact_id]) if params[:device][:contact_id]
    @device = Current.account.devices.build(device_params)
    @device.contact = contact
    if @device.save
      render json: @device, status: :ok, message: "Device create successfully!"
    else
      render json: @device.errors.full_messages, status: :unprocessable_entity, errors: "Something went wrong!"
    end
  end

  private

  def device_params
    params.require(:device).permit(:name, :event_name, :platform, :advertising_identifier, :vendor_identifier, :os_version, :device_timezone, :device_model, user_attributes: {})
  end

  def find_device
    @device = Device.find_by(id: params[:id])
    unless @device
      render json: { error: "Device with ID #{params[:id]} not found" }
    end
  end
end
