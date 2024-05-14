import React from 'react';
import './styles/Forms.css';

const FormComponent = ({ title, inputs, handleSubmit }) => {
    return (
        <div className="container flex flex-column">
            <h1 className="text-center">{title}</h1>
            <form className="text-center" onSubmit={handleSubmit} data-testid="form">
                {inputs.map((input, index) => (
                    <div key={index}>
                        <label>
                            {input.label}
                            <input
                                type={input.type}
                                name={input.name}
                                value={input.value}
                                onChange={input.onChange}
                                required={input.required}
                                disabled={input.disabled}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">{title}</button>
            </form>
        </div>
    );
};

export default FormComponent;
