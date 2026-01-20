import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory } from '../../services/categoryService';
import { updateTask } from '../../services/taskService';
import './TaskDialog.scss'

export default function TaskDialog({ isOpen, onClose, onSave, taskToEdit, isViewMode }) {
    const PRESET_COLORS = [
        '#6C5CE7',
        '#FF9F1C',
        '#FF6B6B',
        '#FFD93D',
        '#6BCB77',
        '#4D96FF', 
        '#A5B1C2',
        '#FF9FF3'
    ];
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 0,
        category_id: ''
    });

    const [categories, setCategories] = useState([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);
    const [errorMessage, setErrorMessage] = useState('');

    // carregar categories quando o dialog abre
    useEffect(() => {
        setErrorMessage('');
        if (isOpen) {
            fetchCategories();
            setIsAddingCategory(false);
            setNewCategoryName('');
        }
    }, [isOpen]);

    // preencher o formulário se for edição
    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description,
                due_date: taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '', 
                priority: taskToEdit.priority,
                category_id: taskToEdit.category_id
            });
        } else {
            setFormData({
                title: '', description: '', due_date: '', priority: 0, category_id: ''
            });
        }
    }, [taskToEdit, isOpen]);

    const fetchCategories = async () => {
        const [data, error] = await getAllCategories();
        if (data) setCategories(data);
    };

    const handleChange = (e) => {
        setErrorMessage('');
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        setErrorMessage('');
        e.preventDefault();
        onSave(formData);
    };

    const handleCreateCategory = async () => {
        setErrorMessage('');
        // pra caso o nome esteja vazio
        if (!newCategoryName.trim()) return; 

        const color = newCategoryColor.slice(1);
        
        const payload = { 
            category: { 
                name: newCategoryName, 
                color: color
            } 
        };

        const [newCat, error] = await createCategory(payload);

        if (newCat) {
            // adiciona na lista atual
            setCategories([...categories, newCat]);

            // já seleciona ela no form atual
            setFormData(prev => ({ ...prev, category_id: newCat.id }));

            // limpa e fecha
            setNewCategoryName('');
            setIsAddingCategory(false);
        } else {
            setErrorMessage('Erro: Categoria já existente.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal_overlay">
            <div className="modal_content">
                <div className="modal_header">
                    <h2>
                        {isViewMode ? 'Visualizar Tarefa' : (taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa')}
                    </h2>
                    <button className="close" onClick={onClose} >
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <label>Título</label>
                        <input name="title" value={formData.title} onChange={handleChange} 
                            disabled={isViewMode} required />
                    </div>
                    <div className="form_group">
                        <label>Descrição</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} 
                            disabled={isViewMode}rows="3"/>
                    </div>
                    <div className="form_group">
                        <label>Prazo</label>
                        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} 
                            disabled={isViewMode}required/>
                    </div>

                    <div className="form_group">
                        <label>Prioridade</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} disabled={isViewMode}>
                            <option value={0}>Baixa</option>
                            <option value={1}>Média</option>
                            <option value={2}>Alta</option>
                        </select>
                    </div>

                    <div className="form_group">
                        <label>Categoria</label>
                        
                        {!isAddingCategory ? (
                            <div className="addCategory">
                                <select name="category_id" value={formData.category_id} onChange={handleChange} 
                                    disabled={isViewMode} requiredstyle={{ flex: 1 }}>
                                    <option value="">Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                
                                {!isViewMode && (
                                    <button className="add_category_button" type="button" onClick={() => setIsAddingCategory(true)} title="Nova Categoria">
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="new_category_container">
                                <>
                                    <input  type="text" autoFocus placeholder="Nome da categoria..."value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                                        autoFocusstyle={{ flex: 1 }}/>
                                   
                                    <p className="selectAColor">Selecione uma cor:</p>
    
                                    <div className="color_picker_container">
                                        {PRESET_COLORS.map(color => (
                                            <div key={color} onClick={() => setNewCategoryColor(color)}
                                                className={`color_swatch ${newCategoryColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }}/>
                                        ))}
                                    </div>
                                </>
                                <div className="new_category_actions">
                                    <button className="new_category_button confirm" type="button" onClick={handleCreateCategory}>
                                        <i className="bi bi-check-lg"></i>
                                    </button>
                                    <button className="new_category_button cancel" type="button" onClick={() => setIsAddingCategory(false)} >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {errorMessage && (<div className="error">{errorMessage}</div>)}

                    <div className="modal_actions">
                        {!isViewMode && (
                            <button type="submit">Salvar</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}