import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import getStyleSheet from '../styles/ChatMessage';
import PropTypes from 'prop-types';
import TimeAgo from 'react-native-timeago';

const ChatMessage = ({ prev, next, _id, user, selectMessage, index, selected, status, msg, time }) => {

	const frontCorner = prev !== user;
	const backCorner = next !== user;
	const position = frontCorner && backCorner ? 'single' : frontCorner && !backCorner ? 'first' : !frontCorner && backCorner ? 'last' : 'middle';
	const currentUser = user === _id;
	const styles = getStyleSheet({ user: currentUser, position: position });

	return (
		<View style={[
			styles.messageContainer,
			(selected && styles.messageContainerSelected),
		]} >

			{(!currentUser && (backCorner || !next)) && <View style={styles.circle}></View>}

			<TouchableWithoutFeedback onPress={() => selectMessage(index)} >
				<View>

					<View style={[
						styles.message,
						(!!selected && styles.messageSelected),
						(status === 'failed' && styles.messageFailed)
					]}>

						<Text style={styles.messageText}>{msg}</Text>
					</View>

					{selected && (
						<View style={styles.infoContainer}>

							{!!status && (
								<Text>{status} &nbsp;
    							<TimeAgo time={time} />
									{status === 'failed' && <Text style={styles.resend}>&nbsp; Resend</Text>}
								</Text>
							)}
						</View>
					)}

				</View>

			</TouchableWithoutFeedback>

		</View>
	);
};

ChatMessage.propTypes = {
	msg: PropTypes.string.isRequired,
	user: PropTypes.string.isRequired,
	prev: PropTypes.any.isRequired,
	next: PropTypes.any.isRequired,
	_id: PropTypes.string.isRequired,
	time: PropTypes.any.isRequired,

	selectMessage: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	selected: PropTypes.bool.isRequired,
	status: PropTypes.string.isRequired
};

export default ChatMessage;