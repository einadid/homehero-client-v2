import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop - Fixed position to cover whole screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container - Centers the modal */}
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-light-100 dark:bg-dark-200 rounded-2xl shadow-2xl border border-light-400 dark:border-dark-100 flex flex-col max-h-[90vh]"
            >
              {/* Header (Fixed at top of modal) */}
              <div className="flex items-center justify-between p-5 border-b border-light-400 dark:border-dark-100 shrink-0">
                <h2 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-light-300 dark:hover:bg-dark-100 transition-colors text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;