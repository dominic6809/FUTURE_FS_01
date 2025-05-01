// client/src/pages/admin/Contacts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  EnvelopeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Contacts = () => {
  const { getAuthHeader } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contact', {
        headers: getAuthHeader()
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/contact/${id}`, 
        { status },
        { headers: getAuthHeader() }
      );
      
      fetchMessages();
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/api/contact/${id}`, {
          headers: getAuthHeader()
        });
        fetchMessages();
        toast.success('Message deleted successfully');
        
        if (activeMessage?._id === id) {
          setActiveMessage(null);
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const viewMessage = (message) => {
    setActiveMessage(message);
    setIsModalOpen(true);
    
    // If message is unread, mark it as read
    if (message.status === 'unread') {
      handleStatusChange(message._id, 'read');
    }
  };

  // Filter messages by status
  const unreadMessages = messages.filter(message => message.status === 'unread');
  const readMessages = messages.filter(message => message.status === 'read' || message.status === 'replied');
  const resolvedMessages = messages.filter(message => message.status === 'resolved');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
      
      {/* Message stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <EnvelopeIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Unread Messages
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {unreadMessages.length}
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <EyeIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Read Messages
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {readMessages.length}
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Resolved
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                  {resolvedMessages.length}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No messages received yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Recent Messages
            </h3>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((message) => (
              <li 
                key={message._id}
                className={`px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  message.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => viewMessage(message)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <p className={`text-sm font-medium ${
                        message.status === 'unread' 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {message.name}
                      </p>
                      {message.status === 'unread' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          New
                        </span>
                      )}
                      {message.status === 'replied' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Replied
                        </span>
                      )}
                      {message.status === 'resolved' && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      {message.email}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                      <span className="font-medium">{message.subject}</span> - {message.message.substring(0, 80)}
                      {message.message.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message detail modal */}
      {isModalOpen && activeMessage && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Message from {activeMessage.name}
                    </h3>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email:</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          <a href={`mailto:${activeMessage.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                            {activeMessage.email}
                          </a>
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subject:</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activeMessage.subject}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Received on:</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(activeMessage.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                        <p className="text-sm font-medium">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activeMessage.status === 'unread' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : activeMessage.status === 'read'
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              : activeMessage.status === 'replied'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {activeMessage.status.charAt(0).toUpperCase() + activeMessage.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Message:</p>
                        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                            {activeMessage.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* Status change buttons */}
                <button
                  type="button"
                  onClick={() => handleStatusChange(activeMessage._id, 'resolved')}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:text-sm"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Mark Resolved
                </button>
                
                <button
                  type="button"
                  onClick={() => handleStatusChange(activeMessage._id, 'replied')}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-yellow-600 text-white font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:text-sm"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Marked Replied
                </button>
                
                <button
                  type="button"
                  onClick={() => handleDelete(activeMessage._id)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:text-sm"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;