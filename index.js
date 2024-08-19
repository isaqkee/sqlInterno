import { View, Button, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { useState } from 'react';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';
import React, { useEffect } from 'react';

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // Estado para controlar o produto selecionado

    const produtosBD = usarBD();

    async function createOrUpdate() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }

        try {
            if (selectedId) {
                // Se há um ID selecionado, atualizamos o produto existente
                await produtosBD.update({
                    id: selectedId,
                    nome,
                    quantidade: Number(quantidade),
                });
                Alert.alert('Produto atualizado com sucesso!');
            } else {
                // Caso contrário, criamos um novo produto
                const item = await produtosBD.create({
                    nome,
                    quantidade: Number(quantidade),
                });
                Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
                setId(item.idProduto);
            }
            limparCampos();
            listar();
        } catch (error) {
            console.log(error);
        }
    }

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    const limparCampos = () => {
        setNome('');
        setQuantidade('');
        setSelectedId(null);
    };

    useEffect(() => {
        listar();
    }, [pesquisa]);

    const remove = async (id) => {
        try {
            await produtosBD.remove(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    const selecionarProduto = (produto) => {
        setSelectedId(produto.id); // Define o ID do produto selecionado
        setNome(produto.nome); // Preenche o campo "Nome"
        setQuantidade(String(produto.quantidade)); // Preenche o campo "Quantidade"
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.texto} placeholder="Nome" onChangeText={setNome} value={nome} />
            <TextInput style={styles.texto} placeholder="Quantidade" onChangeText={setQuantidade} value={quantidade} />
            <Button title={selectedId ? "Atualizar" : "Salvar"} onPress={createOrUpdate} />
            <TextInput style={styles.texto} placeholder="Pesquisar" onChangeText={setPesquisa} />
            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto
                        data={item}
                        onPress={() => selecionarProduto(item)} // Carrega os dados do produto selecionado
                        isSelected={item.id === selectedId}
                        onDelete={() => remove(item.id)}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 16,
    },
});
