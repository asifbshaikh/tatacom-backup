class Api::V3::Accounts::UsersController < Api::V1::Accounts::BaseController
  def simulate_interaction
    if current_user.simulate_interaction
      render json: current_user, status: :ok
    else
      render json: current_user.errors.full_messages, status: :unprocessable_entity, errors: "Something went wrong!"
    end
  end

  def best_time_to_send
    last_interaction = current_user.last_interaction_at
    best_time = last_interaction + 2.hours
    render json: {best_time_to_send: best_time}, status: :ok
  end

  # def validate_email
  #   if User.new(email: params[:email]).valid?
  #     render json: {valid: true}, status: :ok
  #   else
  #     render json: {valid: false}, status: :unprocessable_entity
  #   end
  # end

  def validate_uid
    uid = params[:uid]
    exists = User.exists?(uid: uid)
    render json: {exists: true}, status: :ok
  end

  def validate_email
    email = params[:email]
    if ValidEmail2::Address.new(email).valid?
      render json: {message: 'valid'}, status: :ok 
    else
      render json: {message: 'invalid'}, status: :unprocessable_entity
    end
  end
end
